export const API_CONSTANT = {
  USER: {
    LOGIN: 'user/login',
  },
  TENANT: {
    CREATE: 'start/tenant',
    UPDATE: 'update/tenant',
    STOP: 'stop/tenant',
    FETCH: 'fetch/tenant',
    REMOVE_CONSTRAINTS: 'tenant/remove/constraints',
    ADD_CONSTRAINTS: 'tenant/add/constraints',
    RESTART: 'restart/tenant',
    FETCH_WITH_PAGINATION: 'tenants/fetch',
    EXPORT_BANKO_EXCEL: 'bankelo/tenant/export_excel',
    APPLE_VERIFICATION_FILE_UPLOAD: 'apple/verification/file/upload'
  },
  BONANZA_CONNECT: {
    CREATE_TENANT: 'bonanzaconnect/create/tenant',
  },
  GHL: {
    CREATE_LOCATION: 'ghl/create/location',
  },
  BANKELO: {
    CREATE_TENANT: 'bankelo/create/tenant',
    UPLOAD_DOCUMENT: 'bankelo/upload/document',
    ONBOARDING: 'bankelo/onboarding',
    ONBOARDING_DOCUMENT: 'bankelo/onboarding/create_document_with_file',
  },
};
