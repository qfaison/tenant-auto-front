/**
 * App-wide constants
 * Migrated from Angular APP_CONSTANT
 */
export const APP_CONSTANT = {
  ROUTES: {
    USER: {
      LOGIN: 'login',
    },
    TENANT: {
      TENANT: 'tenant',
      LIST: 'tenant/list',
      DETAIL: 'tenant/detail',
    },
  },
  LOCAL_STORAGE: {
    TOKEN: '__token',
  },
  /** Cookie set on login so middleware can protect routes */
  AUTH_COOKIE_NAME: 'tenant-dashboard-auth',
  LIMIT: 10,
} as const;

/**
 * Tenant-related constants
 */
export const TENANT_CONSTANTS = {
  DOMAINS: ['bcomm.app', 'enterprisehub.io'] as const,
  SPACING: {
    ICON_MARGIN: 8,
    TITLE_MARGIN_BOTTOM: 16,
    FORM_ITEM_MARGIN_TOP: 24,
    CARD_BODY_PADDING: 24,
    TOOLBAR_PADDING: 16,
    TITLE_MARGIN_BOTTOM_SMALL: 8,
  },
  SIZES: {
    SEARCH_MAX_WIDTH: 325,
    SEARCH_MIN_WIDTH: 200,
    SELECT_WIDTH: 140,
  },
  TABLE: {
    COLUMN_WIDTHS: {
      TENANT_ID: 120,
      TENANT_NAME: 150,
      CUSTOM_DOMAIN: 180,
      EMAIL: 200,
      CANCEL_REQUEST: 140,
      BANKELO_ONBOARDING: 160,
    },
  },
} as const;
