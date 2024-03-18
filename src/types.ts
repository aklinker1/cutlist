import { z } from 'zod';

export const ProjectSource = z.object({
  type: z.literal('onshape'),
  id: z.string(),
  assemblyId: z.string().optional(),
});
export type ProjectSource = z.infer<typeof ProjectSource>;

export interface Stock {
  name: string;
  material: string;
  thickness: number;
  width: number;
  length: number;
}

export const StockMatrix = z.object({
  name: z.string(),
  material: z.string(),
  thickness: z.number(),
  width: z.number(),
  length: z.array(z.number()),
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
