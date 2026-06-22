import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parseOnshapeUrl } from '@aklinker1/cutlist/onshape';
import useExtendedNitroApp from '~/server/composables/useExtendedNitroApp';

const cacheDir = join(process.cwd(), '.onshape-cache');

export default defineEventHandler(async (event) => {
  const { onshape } = useExtendedNitroApp();
  const query = getQuery(event);
  const url = String(query.url ?? '');
  const refresh = query.refresh === 'true';

  if (!url) {
    setResponseStatus(event, 400);
    return { message: 'Missing url parameter' };
  }

  let ids;
  try {
    ids = parseOnshapeUrl(url);
  } catch {
    setResponseStatus(event, 400);
    return { message: 'Invalid Onshape URL' };
  }

  const cacheFile = join(
    cacheDir,
    `${ids.did}-${ids.wvmid ?? 'default'}-${ids.eid}.json`,
  );

  if (!refresh) {
    try {
      const cached = await readFile(cacheFile, 'utf-8');
      return JSON.parse(cached);
    } catch {
      // Cache miss, fall through to fetch
    }
  }

  const parts = await onshape.getParts(url);

  try {
    await mkdir(cacheDir, { recursive: true });
    await writeFile(cacheFile, JSON.stringify(parts), 'utf-8');
  } catch (err) {
    console.error('Failed to write Onshape cache:', err);
  }

  return parts;
});
