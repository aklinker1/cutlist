import { FetchError } from 'ofetch';
import useExtendedNitroApp from '~/server/composables/useExtendedNitroApp';

const ALLOWED_URL_REGEX = [
  /assemblies\/d\/[0-9a-z]+\/w\/[0-9a-z]+\/e\/[0-9a-z]+\/bom\?indented=false/,
  /documents\/[0-9a-z]+/,
  /parts\/d\/[0-9a-z]+\/[vw]\/[0-9a-z]+\/e\/[0-9a-z]+\/partid\/[a-zA-Z]{3}\/boundingboxes\?configuration=.*/,
];

export default defineEventHandler(async (event) => {
  const { onshape } = useExtendedNitroApp();
  const url = event.node.req.originalUrl!.replace('/api/onshape/', '');

  if (!ALLOWED_URL_REGEX.find((regex) => regex.test(url))) {
    setResponseStatus(event, 400);
    return {
      message: 'URL is not allowed',
      url,
    };
  }

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
