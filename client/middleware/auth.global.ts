export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/auth') return;

  const token = useCookie('auth_token');

  if (!token.value) return navigateTo('/auth', { external: true });
});
