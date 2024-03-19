import { FetchError } from 'ofetch';
import useExtendedNitroApp from '~/server/composables/useExtendedNitroApp';

export default defineEventHandler(async (event) => {
  const { onshape } = useExtendedNitroApp();
  const url = event.req.originalUrl!.replace('/api/onshape/', '');

  try {
    return await onshape.fetch(url);
  } catch (err) {
    if (err instanceof FetchError) {
      setResponseStatus(event, err.statusCode, err.statusMessage);
      return err.response?._data ?? {};
    }
    throw err;
  }
});
