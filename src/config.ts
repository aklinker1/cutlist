import { loadConfig as loadC12Config } from "c12";
import { z } from "zod";
import { onshape } from "./onshape";

export async function loadConfig() {
  const resolved = await loadC12Config<Config>({
    name: "cutlist",
  });
  const config = Config.parse(resolved.config);
  onshape.setAuth(config.accessKey, config.secretKey);
  return config;
}

export const Config = z.object({
  accessKey: z.string(),
  secretKey: z.string(),
  bladeWidth: z.number().default(1 / 8),
  optimize: z.union([z.literal("space"), z.literal("cuts")]).default("cuts"),
});
export type Config = z.infer<typeof Config>;
