import type { Point, Rectangle } from '../geometry';
import type { Visualizer } from '../visualizers';
import type { PackOptions, PackResult, Packer } from './Packer';
import { isValidPlacement } from './utils';

export function createGenericPacker<T>({
  visualizer,
  sortPlacements,
  getPossiblePlacements,
}: {
  visualizer?: Visualizer;
  sortPlacements?: (a: Point, b: Point, options: PackOptions) => number;
  getPossiblePlacements: (
    bin: Rectangle<unknown>,
    placements: Rectangle<T>[],
    gap: number,
  ) => Point[];
}): Packer<T> {
  return {
    pack(bin, rects, options) {
      const res: PackResult<T> = {
        leftovers: [],
        placements: [],
      };
      this.addToPack(res, bin, rects, options);
      return res;
    },
    addToPack(res, bin, rects, options) {
      return rects.reduce<PackResult<T>>((res, rect) => {
        visualizer?.render('start', { res, bin, toPlace: rect });
        const possiblePoints = getPossiblePlacements(
          bin,
          res.placements,
          options.gap,
        );
        if (sortPlacements)
          possiblePoints.sort((a, b) => sortPlacements(a, b, options));
        visualizer?.render('possible-points', {
          res,
          bin,
          toPlace: rect,
          possiblePoints,
        });
        const possiblePlacements = possiblePoints.flatMap((point) => {
          const moved = rect.moveTo(point);
          if (options.allowRotations) {
            return [moved, moved.flipOrientation()];
          }
          return moved;
        });

        const validPlacements = possiblePlacements.filter((placement) =>
          isValidPlacement(bin, res.placements, placement, options.precision),
        );
        visualizer?.render('placements', {
          res,
          bin,
          toPlace: rect,
          validPlacements,
          possiblePlacements,
        });
        if (validPlacements.length > 0) {
          res.placements.push(validPlacements[0]);
        } else {
          res.leftovers.push(rect.data);
        }
        visualizer?.render('placed', { res, bin });
        return res;
      }, res);
    },
  };
}
