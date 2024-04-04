import { defineOnshapeLoader } from '@aklinker1/cutlist/onshape';
import { type ExtendedNitroApp } from '../composables/useExtendedNitroApp';

export default defineNitroPlugin((nitro) => {
  const config = useRuntimeConfig();
  (nitro as ExtendedNitroApp).onshape = defineOnshapeLoader({
    auth: config.onshape,
  });
});
