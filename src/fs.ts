import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export async function writeJson(file: string, object: any) {
  await mkdir(dirname(file), { recursive: true });
  return await writeFile(file, JSON.stringify(object, null, 2), "utf8");
}
