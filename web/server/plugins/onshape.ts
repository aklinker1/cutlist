import { defineOnshapeApi } from '../../../src/onshape';
import { type ExtendedNitroApp } from '../composables/useExtendedNitroApp';

export default defineNitroPlugin((nitro) => {
  const config = useRuntimeConfig();
  (nitro as ExtendedNitroApp).onshape = defineOnshapeApi({
    auth: config.onshape,
  });
});
