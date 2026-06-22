import { Point, isNearlyEqual } from '../geometry';
import type { Visualizer } from '../visualizers';
import { createGenericPacker } from './GenericPacker';
import type { Packer } from './Packer';

export function createTightPacker<T>(visualizer?: Visualizer): Packer<T> {
  return createGenericPacker({
    getPossiblePlacements: (bin, placements, gap) => {
      const xs = [bin.left, ...placements.map((r) => r.right + gap)];
      const ys = [bin.bottom, ...placements.map((r) => r.top + gap)];
      return xs.flatMap((x) => ys.map((y) => new Point(x, y)));
    },
    sortPlacements(a, b, options) {
      // sort bottom most first, leftmost second
      if (!isNearlyEqual(a.y, b.y, options.precision)) return a.y - b.y;
      return a.x - b.x;
    },
    visualizer,
  });
}
