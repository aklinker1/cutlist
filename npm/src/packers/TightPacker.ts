import { isNearlyEqual } from '../geometry';
import type { Visualizer } from '../visualizers';
import { createGenericPacker } from './GenericPacker';
import type { Packer } from './Packer';

export function createTightPacker<T>(visualizer?: Visualizer): Packer<T> {
  return createGenericPacker({
    getPossiblePlacements: (bin, placements, gap) => [
      bin.bottomLeft,
      ...placements.map((rect) => rect.topLeft.add(0, gap)),
      ...placements.map((rect) => rect.bottomRight.add(gap, 0)),
    ],
    sortPlacements(a, b, options) {
      // sort bottom most first, leftmost second
      if (!isNearlyEqual(a.y, b.y, options.precision)) return a.y - b.y;
      return a.x - b.x;
    },
    visualizer,
  });
}
