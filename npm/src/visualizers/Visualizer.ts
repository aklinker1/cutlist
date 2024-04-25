import type { Point, Rectangle } from '../geometry';
import type { PackResult } from '../packers';

export interface Visualizer {
  render(description: string, options: RenderOptions): void;
}

export interface RenderOptions {
  bin: Rectangle<unknown>;
  res: PackResult<unknown>;
  toPlace?: Rectangle<unknown>;
  possiblePoints?: Point[];
  possiblePlacements?: Rectangle<unknown>[];
  validPlacements?: Rectangle<unknown>[];
}
