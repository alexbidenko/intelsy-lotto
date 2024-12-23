export default defineNuxtPlugin((nuxtApp) => {
  const serverApiHost = nuxtApp.ssrContext?.runtimeConfig.serverApiHost as string;

  StrictFetch.init({
    baseURL: `${serverApiHost || ''}/api/`,
  });
});
