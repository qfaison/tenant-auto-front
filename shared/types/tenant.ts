/**
 * TypeScript types for Tenant entities
 */

export interface Tenant {
  tenantId: string;
  tenantName?: string;
  customDomain?: string;
  email?: string;
  api?: string;
  apiKey?: string;
  domainName?: string;
  threePL?: string;
  ws2Url?: string;
  erpUrl?: string;
  ipAddress?: string;
  ipnUrl?: string;
  cancelRequestStatus?: string;
  cancelRequestReason?: string;
  billingStatus?: string;
  bPlanned?: { dashboard_url?: string;[key: string]: unknown };
  sslIssuedAt?: string | Date;
  sslExpiryDate?: string | Date;
  bankelo?: BankeloInfo;
  ghl?: GHLInfo;
  bonanzaConnect?: BonanzaConnectInfo;
  [key: string]: unknown; // Allow additional properties
}

export interface BankeloInfo {
  legalName?: string;
  externalId?: string;
  registrationNumber?: string;
  side?: string;
  organizationType?: string;
  industry?: string;
  countryOfOperation?: string;
  countryOfRegistration?: string;
  countryOfOwnership?: string;
  dateOfIncorporation?: string;
  shareholders?: string;
  parentOrganization?: string;
  primaryBusinessActivity?: string;
  additionalInformation?: string;
  documents?: Array<{
    label: string;
    identifier: string;
    url: string;
  }>;
  [key: string]: unknown;
}

export interface GHLInfo {
  name?: string;
  phone?: string;
  companyId?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  timezone?: string;
  [key: string]: unknown;
}

export interface BonanzaConnectInfo {
  [key: string]: unknown;
}

export interface TenantListResponse {
  data: Tenant[];
  totalCounts: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalSize: number;
}
