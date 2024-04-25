import type { Point, Rectangle } from '../geometry';

export function getAllPossiblePlacements<T>(
  bin: Rectangle<unknown>,
  placements: Rectangle<T>[],
  gap: number,
): Point[] {
  return [
    bin.bottomLeft,
    ...placements.map((rect) => rect.topLeft.add(0, gap)),
    ...placements.map((rect) => rect.bottomRight.add(gap, 0)),
  ];
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
