import {
  type PartToCut,
  type Stock,
  type StockMatrix,
  Config,
  type BoardLayout,
  type BoardLayoutLeftover,
  type BoardLayoutPlacement,
} from './types';
import consola from 'consola';
import { Rectangle } from './geometry';
import { isValidStock } from './utils/stock-utils';
import { Distance } from './utils/units';
import { createCutPacker, createTightPacker, type Packer } from './packers';
import { HashSet } from './utils/HashSet';
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

  const boards = reduceStockMatrix(stock).toSorted(
    (a, b) => b.width * b.length - a.width * a.length,
  );
  if (boards.length === 0) throw Error('You must include at least 1 stock.');

  const { layouts, leftovers } = placeAllParts(
    config,
    parts,
    boards,
    visualizer,
  );

  const minimizedLayouts = layouts.map((layout) =>
    minimizeLayout(config, layout, boards),
  );

  return {
    layouts: minimizedLayouts,
    leftovers,
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

function mapPlacementToBoardLayoutPlacement(
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

function mapPartToPlaceToBoardLayoutLeftover(
  part: PartToCut,
): BoardLayoutLeftover {
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

function placeAllParts(
  config: Config,
  parts: PartToCut[],
  stock: Stock[],
  visualizer?: Visualizer,
): { layouts: BoardLayout[]; leftovers: BoardLayoutLeftover[] } {
  const packer = PACKERS[config.optimize](visualizer);

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
  const layouts: BoardLayout[] = [];

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
    const layout: BoardLayout = {
      placements: [],
      stock: {
        lengthM: board.length,
        material: board.material,
        thicknessM: board.thickness,
        widthM: board.width,
      },
    };

    // Fill the bin
    const partsToPlace = unplacedPartsArray
      .filter((part) => isValidStock(board, part, config.precision))
      .map(
        (part) => new Rectangle(part, 0, 0, part.size.width, part.size.length),
      );

    // Fill the layout
    const res = packer.pack(boardRect, partsToPlace, {
      allowRotations: true,
      gap: new Distance(config.bladeWidth).m,
      precision: config.precision,
    });
    if (res.placements.length > 0) {
      layouts.push(layout);
      res.placements.forEach((placement) => {
        layout.placements.push(mapPlacementToBoardLayoutPlacement(placement));
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
    leftovers: leftovers.map(mapPartToPlaceToBoardLayoutLeftover),
  };
}

function minimizeLayout(
  config: Config,
  layout: BoardLayout,
  stock: Stock[],
): BoardLayout {
  consola.warn('TODO: Minimize layouts');
  return layout;
}
