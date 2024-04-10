import {
  type PartToCut,
  type Stock,
  type StockMatrix,
  Config,
  type BoardLayout,
  type BoardLayoutLeftover,
} from './types';
import consola from 'consola';
import { BoardLayouter, Rectangle, isValidStock } from './geometry';
import { Distance } from './units';

export * from './types';
export * from './units';

/**
 * Given a list of parts, stock, and some configuration, return the board
 * layouts (where each part goes on stock) and all the leftover parts that
 * couldn't be placed.
 */
export function generateBoardLayouts(
  parts: PartToCut[],
  stock: StockMatrix[],
  config: Config,
): {
  layouts: BoardLayout[];
  leftovers: BoardLayoutLeftover[];
} {
  config = Config.parse(config);
  consola.info('Generating board layouts...');

  // Create geometry for stock and parts
  const boards = reduceStockMatrix(stock)
    .map((stock) => new Rectangle(stock, 0, 0, stock.width, stock.length))
    .toSorted((a, b) => b.area - a.area);
  if (boards.length === 0) {
    throw Error('You must include at least 1 stock.');
  }

  // Generate the layouts
  const partQueue = [...parts].sort(
    (a, b) => b.size.width * b.size.length - b.size.width * a.size.length,
    // // Sort by material, thickness, and area to ensure parts of the same
    // // material and thickness are placed together, and that larger items are
    // // placed first.
    // (a, b) => {
    //   const materialCompare = a.material.localeCompare(b.material);
    //   if (materialCompare != 0) return materialCompare;

    //   const thicknessCompare = b.size.thickness - a.size.thickness;
    //   if (Math.abs(thicknessCompare) > 1e-5) return thicknessCompare;

    //   return b.size.width * b.size.length - a.size.width * a.size.length;
    // },
  );
  const leftovers: PartToCut[] = [];
  const layouts: BoardLayouter[] = [];
  while (partQueue.length > 0) {
    const part = partQueue.shift()!;
    const addedToExisting = layouts.find((layout) => layout.tryAddPart(part));
    if (addedToExisting) {
      continue;
    }

    const matchingStock = boards.find(
      (stock) => stock.data.material === part.material,
    );
    // const matchingStock = boards.find((stock) =>
    //   isValidStock(stock.data, part),
    // );
    if (matchingStock == null) {
      consola.warn(
        `Not stock found for ${part.material} @ ${part.size.thickness}`,
      );
      leftovers.push(part);
      continue;
    }

    const newLayout = new BoardLayouter(matchingStock, config);
    const addedToNew = newLayout.tryAddPart(part);
    if (addedToNew) {
      layouts.push(newLayout);
    } else {
      leftovers.push(part);
    }
  }

  return {
    layouts: layouts.map((layout) =>
      layout.reduceStock(boards).toBoardLayout(),
    ),
    leftovers: leftovers.map((item) => ({
      instanceNumber: item.instanceNumber,
      partNumber: item.partNumber,
      name: item.name,
      material: item.material,
      lengthM: item.size.length,
      widthM: item.size.width,
      thicknessM: item.size.thickness,
    })),
  };
}

/**
 * Given a stock matrix, reduce it down to the individual boards available.
 */
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
