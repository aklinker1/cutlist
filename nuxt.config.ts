import { resolve } from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'web',
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  ssr: true, // SSG
  runtimeConfig: {
    onshape: {
      accessKey: '',
      secretKey: '',
    },
  },
  nitro: {
    plugins: [resolve('web/server/plugins/onshape.ts')],
  },
});
