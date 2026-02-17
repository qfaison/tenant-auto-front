import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Client-side rendering configuration
  // All pages will use 'use client' directive for CSR
};

export default withNextIntl(nextConfig);
