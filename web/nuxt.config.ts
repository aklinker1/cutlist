import { resolve } from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  ssr: true, // SSG
  alias: {
    '@aklinker1/cutlist': resolve('../npm/src'),
  },
  runtimeConfig: {
    onshape: {
      accessKey: '',
      secretKey: '',
    },
  },
  nitro: {
    plugins: [resolve('server/plugins/onshape.ts')],
  },
  app: {
    head: {
      title: 'Cutlist Generator',
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ rel: 'icon', href: 'favicon.svg' }],
      meta: [
        {
          name: 'description',
          content:
            'Find the best way to cut boards and panels for projects designed in Onshape. When you make changes to your design, the cutlist updates automatically.',
        },
      ],
    },
  },
});
