import { z } from 'zod';

export const ProjectSource = z.object({
  type: z.literal('onshape'),
  id: z.string(),
  assemblyId: z.string().optional(),
});
export type ProjectSource = z.infer<typeof ProjectSource>;

const Distance = z.union([z.number(), z.string()]);

export interface Stock {
  material: string;
  thickness: number;
  width: number;
  length: number;
}

export const StockMatrix = z.object({
  material: z.string(),
  thickness: Distance,
  width: Distance,
  length: z.array(Distance),
});
export type StockMatrix = z.infer<typeof StockMatrix>;

export const Project = z.object({
  source: ProjectSource,
});
export type Project = z.infer<typeof Project>;

export interface PartToCut {
  partNumber: number;
  instanceNumber: number;
  name: string;
  material: string;
  size: {
    width: number;
    length: number;
    thickness: number;
  };
}

export const Config = z.object({
  bladeWidth: Distance.default('0.125in'),
  optimize: z.union([z.literal('space'), z.literal('cuts')]).default('cuts'),
});
export type Config = z.infer<typeof Config>;
