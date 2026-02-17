import { getRequestConfig } from 'next-intl/server';

// Supported locales - starting with English only
export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

/**
 * Get locale from request
 * Priority: URL → localStorage → browser → default
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // This will be used by next-intl to determine the locale
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../locale/${locale}.json`)).default,
  };
});
