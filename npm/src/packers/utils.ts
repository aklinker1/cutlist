import { Point } from '../geometry';
import type { Rectangle } from '../geometry';

export function getAllPossiblePlacements<T>(
  bin: Rectangle<unknown>,
  placements: Rectangle<T>[],
  gap: number,
): Point[] {
  const xs = [bin.left, ...placements.map((r) => r.right + gap)];
  const ys = [bin.bottom, ...placements.map((r) => r.top + gap)];
  return xs.flatMap((x) => ys.map((y) => new Point(x, y)));
}

export function isValidPlacement<T>(
  bin: Rectangle<unknown>,
  placements: Rectangle<T>[],
  rect: Rectangle<T>,
  precision: number,
): boolean {
  return (
    rect.isInside(bin, precision) &&
    placements.every((p) => !rect.isIntersecting(p, precision))
  );
}
