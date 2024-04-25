import type { Rectangle } from '../geometry/Rectangle';

/**
 * Interface responsible for implementing the bin packing algorithm.
 */
export interface Packer<T> {
  pack(
    bin: Rectangle<unknown>,
    rects: Rectangle<T>[],
    options: PackOptions,
  ): PackResult<T>;
  addToPack(
    res: PackResult<T>,
    bin: Rectangle<unknown>,
    rects: Rectangle<T>[],
    options: PackOptions,
  ): void;
}

export interface PackOptions {
  gap: number;
  precision: number;
  allowRotations: boolean;
}

export interface PackResult<T> {
  /**
   * List of rectangles that fit, translated to their packed location.
   */
  placements: Rectangle<T>[];
  /**
   * If the packer supports it, this is the list of cuts required to cut all the rectangles from the part.
   */
  cuts?: Rectangle<undefined>;
  /**
   * Any rectangles that didn't fit are returned here. Their positions are left untouched.
   */
  leftovers: T[];
}
