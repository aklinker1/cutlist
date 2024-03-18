import { onshape } from './onshape';
import type { PartToCut, Project, Stock, StockMatrix } from './types';
import consola from 'consola';
import { p } from '@antfu/utils';
import { convertInToPx, convertMtoIn } from './units';
import { BoardLayout, Rectangle } from './geometry';
import type { Config } from './config';

export type * from './types';
export * from './config';

export function createCutlistGenerator(
  config: Config,
  debugObject?: (name: string, object: any) => Promise<void>,
) {
  onshape.setAuth(config.accessKey, config.secretKey);

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
              width: convertMtoIn(bounds.highY - bounds.lowY),
              length: convertMtoIn(bounds.highX - bounds.lowX),
              thickness: convertMtoIn(bounds.highZ - bounds.lowZ),
            },
            quantity: Number(headerIdToValue[quantityHeaderId]),
            name: String(headerIdToValue[nameHeaderId]),
            material: material?.displayName,
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
        if (addedToExisting) continue;

        const matchingStock = stockRectangles.find(
          (stock) => stock.data.material === part.material,
        );
        if (matchingStock == null) {
          consola.warn('Not stock found for ' + part.material);
          leftovers.push(part);
          continue;
        }

        layouts.push(new BoardLayout(matchingStock, config));
        partQueue.unshift(part);
      }
      debugObject?.('layouts', layouts);
      debugObject?.('leftovers', leftovers);

      return { layouts, leftovers };
    },
  };
}

export function reduceStockMatrix(matrix: StockMatrix[]): Stock[] {
  return matrix.flatMap((item) =>
    item.length.map((length) => ({
      ...item,
      length,
    })),
  );
}

export function generateSvg(layouts: BoardLayout[]) {
  consola.info('Generating svg...');
  const gap = 4; // in, not pixels
  let marginLeft = 0;
  let bounds = new Rectangle();
  const { stocks, parts } = layouts.reduce<{
    stocks: string[];
    parts: string[];
  }>(
    (acc, layout, layoutIndex) => {
      const stock = layout.stock.translate(marginLeft, 0).flipYAxis();
      bounds = bounds.growTo(stock);
      acc.stocks.push(
        stock.toSvg({
          id: `stock${layoutIndex}`,
          stroke: 'black',
          'stroke-width': 4,
          fill: 'black',
          'fill-opacity': 0.5,
        }),
      );
      layout.placements.forEach((part) => {
        const place = part.translate(marginLeft, 0).flipYAxis();
        bounds = bounds.growTo(place);
        acc.parts.push(
          place.toSvg({
            id: `part${part.data.partNumber}.${part.data.instanceNumber}`,
            stroke: 'red',
            'stroke-width': 4,
            fill: 'none',
          }),
        );
      });
      marginLeft += stock.width + gap;
      return acc;
    },
    { stocks: [], parts: [] },
  );

  const svgPadding = convertInToPx(2);
  return `
    <svg viewBox="${convertInToPx(bounds.x) - svgPadding} ${convertInToPx(bounds.y) - svgPadding} ${convertInToPx(bounds.width) + svgPadding * 2} ${convertInToPx(bounds.height) + svgPadding * 2}" height="100%" xmlns="http://www.w3.org/2000/svg">
      ${stocks.join('\n')}
      ${parts.join('\n')}
    </svg>
  `.trim();
}
