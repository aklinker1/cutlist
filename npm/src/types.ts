import { z } from 'zod';

/**
 * A number in meters or a string with unit suffix ("1in").
 */
const Distance = z.union([z.number(), z.string()]);
type Distance = z.infer<typeof Distance>;

/**
 * Contains the material and dimensions for a single panel or board.
 */
export interface Stock {
  /**
   * The material name, matching what is set in Onshape.
   */
  material: string;
  /**
   * In meters
   */
  thickness: number;
  /**
   * In meters
   */
  width: number;
  /**
   * In meters
   */
  length: number;
}

/**
 * For a material, define a combination of widths, lengths, and thicknesses
 * that can be combined to form multiple stocks.
 */
export const StockMatrix = z.object({
  material: z.string(),
  thickness: z.array(Distance),
  width: z.array(Distance),
  length: z.array(Distance),
});
export type StockMatrix = z.infer<typeof StockMatrix>;

/**
 * Part info, material, and size. Everything needed to know how to layout the board on stock.
 */
export interface PartToCut {
  partNumber: number;
  instanceNumber: number;
  name: string;
  material: string;
  size: {
    /**
     * In meters
     */
    width: number;
    /**
     * In meters
     */
    length: number;
    /**
     * In meters
     */
    thickness: number;
  };
}

/**
 * Options for generating the board layouts.
 */
export const Config = z.object({
  /**
   * The blade kerf, usually around 0.125 inches.
   */
  bladeWidth: Distance.default('0.125in'),
  /**
   * The optimization method when laying out the parts on the stock.
   * - `"space"`: Pack as many parts onto each peice of stock as possible
   * - `"cuts"`: Generate board layouts optimizing for a minimal number of
   *    cuts. This usually results in stacking peices with the same width in a
   *    column, making it easier to cut out.
   */
  optimize: z.union([z.literal('space'), z.literal('cuts')]).default('cuts'),
  /**
   * Extra padding to add to the top and right sides of the boards/stock.
   */
  extraSpace: Distance.default('0'),
});
export type Config = z.infer<typeof Config>;

export interface BoardLayout {
  stock: BoardLayoutStock;
  placements: BoardLayoutPlacement[];
}

export interface BoardLayoutStock {
  material: string;
  widthM: number;
  lengthM: number;
  thicknessM: number;
}

export interface BoardLayoutLeftover {
  partNumber: number;
  instanceNumber: number;
  name: string;
  material: string;
  widthM: number;
  lengthM: number;
  thicknessM: number;
}

export interface BoardLayoutPlacement extends BoardLayoutLeftover {
  xM: number;
  yM: number;
  leftM: number;
  rightM: number;
  topM: number;
  bottomM: number;
}
