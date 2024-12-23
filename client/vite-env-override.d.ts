declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      BASIC_AUTH_PASSWORD: string;
    }
  }
}

interface BaseRuntimeConfig {
  bitrixClientId: string;
}

interface BasePublicRuntimeConfig {
  siteUrl: string;
}

declare module '@nuxt/schema' {
  interface RuntimeConfig extends BaseRuntimeConfig {}

  interface PublicRuntimeConfig extends BasePublicRuntimeConfig {}
}

declare module 'nuxt/schema' {
  interface RuntimeConfig extends BaseRuntimeConfig {}

  interface PublicRuntimeConfig extends BasePublicRuntimeConfig {}
}

export {};
