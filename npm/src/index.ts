import type { OnshapeApiClient } from './onshape';
import type { PartToCut, Project, Stock, StockMatrix, Config } from './types';
import consola from 'consola';
import { p } from '@antfu/utils';
import { BoardLayout, Rectangle } from './geometry';
import { Distance } from './units';

export * from './types';
export * from './units';

export async function getBoardLayouts(
  onshape: OnshapeApiClient,
  project: Project,
  stock: StockMatrix[],
  config: Config,
  debugObject?: (name: string, object: any) => Promise<void> | void,
) {
  const generator = createCutlistGenerator(onshape, config, debugObject);
  const parts = await generator.getPartsToCut(project);
  return await generator.generateBoardLayouts(parts, stock);
}

export function createCutlistGenerator(
  onshape: OnshapeApiClient,
  config: Config,
  debugObject?: (name: string, object: any) => Promise<void> | void,
) {
  return {
    getPartsToCut: async (project: Project): Promise<PartToCut[]> => {
      const did = project.source.id;

      consola.info('Getting document info...');
      const document = await onshape.getDocument(did);
      await debugObject?.('document', document);
      const wvmid = document.defaultWorkspace.id;

      let eid = project.source.assemblyId;
      if (!eid) {
        consola.info('Assembly ID not provided, finding first assembly...');
        const assemblies = await onshape.getAssemblies(did, wvmid);
        await debugObject?.('assemblies', assemblies);
        consola.log(`Assemblies found: ${assemblies.length}`);
        if (assemblies.length === 0) {
          throw Error(`No assemblies found for ${document.name}`);
        }
        consola.info(`Using "${assemblies[0].name}"`);
        eid = assemblies[0].id;
      }

      const bom = await onshape.getAssemblyBom(did, wvmid, eid);
      await debugObject?.('bom', bom);

      const quantityHeaderId = bom.headers.find(
        (header) => header.propertyName === 'quantity',
      )?.id;
      if (quantityHeaderId == null) {
        consola.log('Headers:', bom.headers);
        throw Error('Could not find quantity column in BOM');
      }

      const nameHeaderId = bom.headers.find(
        (header) => header.propertyName === 'name',
      )?.id;
      if (nameHeaderId == null) {
        consola.log('Headers:', bom.headers);
        throw Error('Could not find name column in BOM');
      }

      const materialHeaderId = bom.headers.find(
        (header) => header.propertyName === 'material',
      )?.id;
      if (materialHeaderId == null) {
        consola.log('Headers:', bom.headers);
        throw Error('Could not find material column in BOM');
      }

      consola.info(`Loading part details: ${bom.rows.length}`);
      const partGroups = await p(bom.rows)
        .map(async ({ itemSource, headerIdToValue }) => {
          const bounds = await onshape.getPartBoundingBox(
            itemSource.documentId,
            itemSource.wvmType,
            itemSource.wvmId,
            itemSource.elementId,
            itemSource.partId,
          );
          const material = headerIdToValue[materialHeaderId] as any;
          return {
            size: {
              width: bounds.highY - bounds.lowY,
              length: bounds.highX - bounds.lowX,
              thickness: bounds.highZ - bounds.lowZ,
            },
            quantity: Number(headerIdToValue[quantityHeaderId]),
            name: String(headerIdToValue[nameHeaderId]),
            material: material?.displayName ?? 'Unknown',
          };
        })
        .map((info, infoI) =>
          Array.from({ length: info.quantity }).map<PartToCut>((_, i) => ({
            name: info.name,
            partNumber: infoI + 1,
            instanceNumber: i + 1,
            size: info.size,
            material: info.material,
          })),
        ).promise;
      const parts = partGroups.flat();
      await debugObject?.('parts', parts);
      consola.info('Total parts:', parts.length);
      return parts.flat();
    },

    generateBoardLayouts: async (
      parts: PartToCut[],
      availableStock: StockMatrix[],
    ): Promise<{ layouts: BoardLayout[]; leftovers: PartToCut[] }> => {
      consola.info('Generating board layouts...');

      // Create geometry for stock and parts
      const stockRectangles = reduceStockMatrix(availableStock)
        .map((stock) => new Rectangle(stock, 0, 0, stock.width, stock.length))
        .toSorted((a, b) => b.area - a.area);
      await debugObject?.('stock-rectangles', stockRectangles);
      if (stockRectangles.length === 0) {
        throw Error('You must include at least 1 stock.');
      }

      // Generate the layouts
      const partQueue = [...parts].sort(
        (a, b) => b.size.width * b.size.length - b.size.width * a.size.length,
      );
      const leftovers: PartToCut[] = [];
      const layouts: BoardLayout[] = [];
      while (partQueue.length > 0) {
        const part = partQueue.shift()!;
        const addedToExisting = layouts.find((layout) =>
          layout.tryAddPart(part),
        );
        if (addedToExisting) {
          continue;
        }

        const matchingStock = stockRectangles.find(
          (stock) => stock.data.material === part.material,
        );
        if (matchingStock == null) {
          consola.warn('Not stock found for ' + part.material);
          leftovers.push(part);
          continue;
        }

        const newLayout = new BoardLayout(matchingStock, config);
        const addedToNew = newLayout.tryAddPart(part);
        if (addedToNew) {
          layouts.push(newLayout);
        } else {
          leftovers.push(part);
        }
      }
      debugObject?.('layouts', layouts);
      debugObject?.('leftovers', leftovers);

      const optimizedLayouts = layouts.map((layout) =>
        layout.reduceStock(stockRectangles),
      );

      return { layouts: optimizedLayouts, leftovers };
    },
  };
}

export function reduceStockMatrix(matrix: StockMatrix[]): Stock[] {
  return matrix.flatMap((item) =>
    item.length.flatMap((length) =>
      item.width.flatMap((width) =>
        item.thickness.map((thickness) => ({
          ...item,
          thickness: new Distance(thickness).m,
          width: new Distance(width).m,
          length: new Distance(length).m,
        })),
      ),
    ),
  );
}
