import type { ProviderGetImage } from '@nuxt/image';

import { getImage as ipxProvider } from '#image/providers/ipx';

export const getImage: ProviderGetImage = (src, options, ctx) => {
  if (/^https?:\/\//.test(src))
    src = src.replace(useRuntimeConfig().public.origin, '');

  return ipxProvider(src, options, ctx);
};
