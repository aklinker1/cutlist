import {
  type PartToCut,
  type Stock,
  type StockMatrix,
  Config,
  type BoardLayout,
  type BoardLayoutLeftover,
  type BoardLayoutPlacement,
  type PotentialBoardLayout,
} from './types';
import consola from 'consola';
import { Rectangle } from './geometry';
import { isValidStock } from './utils/stock-utils';
import { Distance } from './utils/units';
import {
  createCutPacker,
  createTightPacker,
  type PackOptions,
  type Packer,
} from './packers';
import type { Visualizer } from './visualizers';

export * from './types';
export * from './utils/units';

/**
 * Given a list of parts, stock, and some configuration, return the board
 * layouts (where each part goes on stock) and all the leftover parts that
 * couldn't be placed.
 *
 * General order of operations:
 * 1. Load parts that need to be placed
 * 2. Fill stock with parts until no more parts can be placed
 * 3. Try and reduce the size of final boards to minimize material usage
 *
 * The second step, filling the stock, is not simple. There's a few
 * implementations:
 * - Optimize for space - A simple, greedy algorithm that just packs parts in as
 *   tight as possible
 * - Optimize for cuts - A variant of the [Guillotine cutting algorithm](https://en.wikipedia.org/wiki/Guillotine_cutting)
 *   that generates part placements that are easy to cut out with a
 *   table/circular/track saw.
 */
export function generateBoardLayouts(
  parts: PartToCut[],
  stock: StockMatrix[],
  config: Config,
  visualizer?: Visualizer,
): {
  layouts: BoardLayout[];
  leftovers: BoardLayoutLeftover[];
} {
  config = Config.parse(config);
  consola.info('Generating board layouts...');
  const packer = PACKERS[config.optimize](visualizer);

  const boards = reduceStockMatrix(stock).toSorted(
    (a, b) => b.width * b.length - a.width * a.length,
  );
  if (boards.length === 0) throw Error('You must include at least 1 stock.');

  const { layouts, leftovers } = placeAllParts(config, parts, boards, packer);
  const minimizedLayouts = layouts.map((layout) =>
    minimizeLayoutStock(config, layout, boards, packer),
  );

  return {
    layouts: minimizedLayouts.map(serializeBoardLayoutRectangles),
    leftovers: leftovers.map(serializePartToCut),
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

export const PACKERS: Record<
  Config['optimize'],
  (visualizer?: Visualizer) => Packer<PartToCut>
> = {
  cuts: createCutPacker,
  space: createTightPacker,
};

function placeAllParts(
  config: Config,
  parts: PartToCut[],
  stock: Stock[],
  packer: Packer<PartToCut>,
): { layouts: PotentialBoardLayout[]; leftovers: PartToCut[] } {
  const unplacedParts = new Set(
    [...parts].sort(
      // Sort by material, thickness, and area to ensure parts of the same
      // material and thickness are placed together, and that larger items are
      // placed first.
      (a, b) => {
        const materialCompare = a.material.localeCompare(b.material);
        if (materialCompare != 0) return materialCompare;

        const thicknessCompare = b.size.thickness - a.size.thickness;
        if (Math.abs(thicknessCompare) > 1e-5) return thicknessCompare;

        return b.size.width * b.size.length - a.size.width * a.size.length;
      },
    ),
  );
  const leftovers: PartToCut[] = [];
  const layouts: PotentialBoardLayout[] = [];

  while (unplacedParts.size > 0) {
    // Extract all parts from queue, will add them back if not placed
    const unplacedPartsArray = [...unplacedParts];
    const targetPart = unplacedPartsArray[0];

    // Find board to put part on
    // Add a new board if one doesn't match the part
    const board = stock.find((board) =>
      isValidStock(board, targetPart, config.precision),
    );
    if (board == null) {
      console.warn(`Board not found for part:`, targetPart);
      unplacedParts.delete(targetPart);
      leftovers.push(targetPart);
      continue;
    }

    const boardRect = new Rectangle(board, 0, 0, board.width, board.length);
    const layout: PotentialBoardLayout = {
      placements: [],
      stock: board,
    };

    // Fill the bin
    const partsToPlace = unplacedPartsArray
      .filter((part) => isValidStock(board, part, config.precision))
      .map(
        (part) => new Rectangle(part, 0, 0, part.size.width, part.size.length),
      );

    // Fill the layout
    const res = packer.pack(boardRect, partsToPlace, getPackerOptions(config));
    if (res.placements.length > 0) {
      layouts.push(layout);
      res.placements.forEach((placement) => {
        layout.placements.push(placement);
        unplacedParts.delete(placement.data);
      });
    } else {
      res.leftovers.forEach((part) => {
        leftovers.push(part);
        unplacedParts.delete(part);
      });
    }
  }

  return {
    layouts,
    leftovers,
  };
}

/**
 * Given a layout, return a new layout on a smaller peice of stock, if
 * possible. If a smaller stock cannot be found, return the same layout.
 */
function minimizeLayoutStock(
  config: Config,
  originalLayout: PotentialBoardLayout,
  stock: Stock[],
  packer: Packer<PartToCut>,
): PotentialBoardLayout {
  // Get alternative stock, smaller areas first.
  const altStock = stock
    .filter((stock) =>
      isValidStock(originalLayout.stock, stock, config.precision),
    )
    .toSorted((a, b) => a.width * a.length - b.width * b.length);

  for (const smallerStock of altStock) {
    const bin = new Rectangle(
      smallerStock,
      0,
      0,
      smallerStock.width,
      smallerStock.length,
    );
    const rects = [...originalLayout.placements];
    const res = packer.pack(bin, rects, getPackerOptions(config));

    // Return the new layout if there are no leftovers
    if (res.leftovers.length === 0)
      return {
        stock: smallerStock,
        placements: res.placements,
      };
  }

  return originalLayout;
}

function getPackerOptions(config: Config): PackOptions {
  return {
    allowRotations: true,
    gap: new Distance(config.bladeWidth).m,
    precision: config.precision,
  };
}

function serializeBoardLayoutRectangles(
  layout: PotentialBoardLayout,
): BoardLayout {
  return {
    placements: layout.placements.map(serializePartToCutPlacement),
    stock: {
      material: layout.stock.material,
      thicknessM: layout.stock.thickness,
      widthM: layout.stock.width,
      lengthM: layout.stock.length,
    },
  };
}

function serializePartToCutPlacement(
  placement: Rectangle<PartToCut>,
): BoardLayoutPlacement {
  return {
    instanceNumber: placement.data.instanceNumber,
    partNumber: placement.data.partNumber,
    name: placement.data.name,
    material: placement.data.material,
    leftM: placement.left,
    rightM: placement.right,
    topM: placement.top,
    bottomM: placement.bottom,
    lengthM: placement.height,
    thicknessM: placement.data.size.thickness,
    widthM: placement.width,
  };
}

function serializePartToCut(part: PartToCut): BoardLayoutLeftover {
  return {
    instanceNumber: part.instanceNumber,
    partNumber: part.partNumber,
    name: part.name,
    material: part.material,
    lengthM: part.size.length,
    widthM: part.size.width,
    thicknessM: part.size.thickness,
  };
}
