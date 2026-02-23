import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Static export: generates out/ with no Node server. No dynamic routes, no middleware.
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
