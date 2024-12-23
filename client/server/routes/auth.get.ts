import {getQuery, sendRedirect} from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const code = getQuery(event).code as string;

  if (code) {
    const response = await $fetch<{ token: string }>(
      '/api/auth',
      { baseURL: config.serverApiHost, method: 'POST', params: { code } },
    );

    setCookie(event, 'auth_token', response.token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return sendRedirect(event, '/');
  } else {
    const authUrl = `https://mstagency.bitrix24.ru/oauth/authorize/?client_id=${config.bitrixClientId}&response_type=code`;

    return sendRedirect(event, authUrl);
  }
});
