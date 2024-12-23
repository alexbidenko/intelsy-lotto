// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    'nuxt-security',
    'nuxt-strict-fetch',
    '@nuxt/image',
  ],
  ssr: false,
  app: {
    rootAttrs: {
      class: "h-full flex flex-col",
    },
  },
  runtimeConfig: {
    serverApiHost: `http://${process.env.NODE_ENV === 'production' ? 'server' : 'localhost'}:3002`,
    bitrixClientId: process.env.BITRIX_CLIENT_ID,
    public: {
      siteUrl: process.env.NODE_ENV === 'production' ? 'https://lotto.intelsy.ru' : 'http://localhost:3000',
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },
  alias: {
    '#types': './utils/types.d.ts',
  },
  security: {
    headers: {
      contentSecurityPolicy: false,
    },
    basicAuth: {
      enabled: true,
      name: 'intelsy',
      pass: process.env.BASIC_AUTH_PASSWORD,
      message: 'Intelsy Lotto',
      include: ['/admin'],
    },
  },
  tailwindcss: {
    cssPath: './assets/styles/tailwind.scss',
  },
  primevue: {
    importTheme: {
      from: '@/theme.ts',
    },
  },
  image:
    process.env.NODE_ENV === 'development'
      ? {
        alias: { '_nuxt/assets': 'http://localhost:3001/_nuxt/assets' },
        domains: ['http://localhost:3001'],
      }
      : { ipx: { maxAge: 31536000 } },
  hooks: {
    'prerender:routes' ({ routes }) {
      routes.clear();
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
