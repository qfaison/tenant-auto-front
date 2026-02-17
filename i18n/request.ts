import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from '../core/lib/i18n/config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as (typeof locales)[number])) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../core/locale/${locale}.json`)).default,
  };
});
