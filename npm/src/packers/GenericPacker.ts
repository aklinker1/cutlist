import { isNearlyEqual } from '../geometry';
import type { Point, Rectangle } from '../geometry';
import type { Visualizer } from '../visualizers';
import type { PackOptions, PackResult, Packer } from './Packer';
import { isValidPlacement } from './utils';

function contactScore<T>(
  bin: Rectangle<unknown>,
  placements: Rectangle<T>[],
  candidate: Rectangle<T>,
  gap: number,
  precision: number,
): number {
  let score = 0;
  const overlapX = (a: Rectangle<unknown>, b: Rectangle<unknown>) =>
    Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const overlapY = (a: Rectangle<unknown>, b: Rectangle<unknown>) =>
    Math.min(a.top, b.top) - Math.max(a.bottom, b.bottom);

  if (isNearlyEqual(candidate.left, bin.left, precision)) {
    score += candidate.height;
  } else {
    for (const p of placements) {
      if (isNearlyEqual(p.right + gap, candidate.left, precision)) {
        score += Math.max(0, overlapY(candidate, p));
      }
    }
  }

  if (isNearlyEqual(candidate.bottom, bin.bottom, precision)) {
    score += candidate.width;
  } else {
    for (const p of placements) {
      if (isNearlyEqual(p.top + gap, candidate.bottom, precision)) {
        score += Math.max(0, overlapX(candidate, p));
      }
    }
  }

  return score;
}

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
          const best = validPlacements.reduce((best, candidate) => {
            const bScore = contactScore(
              bin,
              res.placements,
              best,
              options.gap,
              options.precision,
            );
            const cScore = contactScore(
              bin,
              res.placements,
              candidate,
              options.gap,
              options.precision,
            );
            return cScore > bScore ? candidate : best;
          });
          res.placements.push(best);
        } else {
          res.leftovers.push(rect.data);
        }
        visualizer?.render('placed', { res, bin });
        return res;
      }, res);
    },
  };
}
