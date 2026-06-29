/**
 * Tenant service - API calls for tenant list and actions
 */
import { apiService } from '@/core/services/api.service';
import { API_CONSTANT } from '@/core/lib/api/endpoints';
import type { Tenant, TenantListResponse } from '@/shared/types/tenant';

export interface FetchTenantsParams {
  skip: number;
  limit: number;
  searchText?: string;
  isOnboarding?: boolean;
}

export interface CreateTenantParams {
  domainName: string;
  tenantName: string;
  customDomain?: string;
  apiKey: string;
  email?: string;
}

export interface UpdateTenantParams {
  tenantId: string;
  customDomain: string;
  sslCertificate?: File;
  privateKey?: File;
  bundle?: File;
}

export interface BonanzaEntriesResult {
  tenantId: string;
  processedEntries: string[];
  isUpToDate: boolean;
  boothUser: Record<string, unknown> | null;
  bonanzaConnectUser: {
    tenantId: string;
    name?: string;
    email?: string;
    isCreated: boolean;
  };
}

export async function fetchTenants(params: FetchTenantsParams): Promise<{ data: Tenant[]; totalCounts: number }> {
  const res = await apiService.get<{ body?: TenantListResponse; data?: Tenant[]; totalCounts?: number }>(
    API_CONSTANT.TENANT.FETCH_WITH_PAGINATION,
    { query: params as unknown as Record<string, unknown> }
  );
  const body = res.data?.body ?? res.data;
  const data = body?.data ?? (res.data as { data?: Tenant[] })?.data ?? [];
  const totalCounts = body?.totalCounts ?? (res.data as { totalCounts?: number })?.totalCounts ?? 0;
  return { data: Array.isArray(data) ? data : [], totalCounts };
}

export async function createTenant(params: CreateTenantParams): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.CREATE, { body: params });
  return res.data;
}

export async function updateTenant(params: UpdateTenantParams): Promise<unknown> {
  const formData = new FormData();
  formData.append('tenantId', params.tenantId);
  formData.append('customDomain', params.customDomain);
  if (params.sslCertificate) formData.append('sslCertificate', params.sslCertificate);
  if (params.privateKey) formData.append('privateKey', params.privateKey);
  if (params.bundle) formData.append('bundle', params.bundle);
  const res = await apiService.put(API_CONSTANT.TENANT.UPDATE, { body: formData });
  return res.data;
}

export async function exportBankelo(): Promise<Blob> {
  const res = await apiService.get<ArrayBuffer>(API_CONSTANT.TENANT.EXPORT_BANKO_EXCEL, {
    headers: { responseType: 'arraybuffer' },
  });
  const buffer = res.data;
  if (buffer instanceof ArrayBuffer) {
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }
  throw new Error('Invalid response');
}

// --- Tenant detail & actions ---

export async function fetchTenant(tenantId: string): Promise<Tenant> {
  const res = await apiService.get<{ body?: Tenant; data?: Tenant }>(
    API_CONSTANT.TENANT.FETCH,
    { query: { tenantId } as Record<string, unknown> }
  );
  const data = res.data?.body ?? res.data?.data ?? res.data;
  if (!data || typeof data !== 'object') throw new Error('Tenant not found');
  return data as Tenant;
}

export async function fetchWebhook(): Promise<{ baseUrl?: string }> {
  const res = await apiService.get<{ body?: { baseUrl?: string }; baseUrl?: string }>(
    API_CONSTANT.WEBHOOK.FETCH,
    {}
  );
  const body = res.data?.body ?? res.data;
  return (body && typeof body === 'object' && 'baseUrl' in body) ? { baseUrl: (body as { baseUrl?: string }).baseUrl } : {};
}

export async function processMissingBonanzaEntries(tenantId: string): Promise<BonanzaEntriesResult> {
  const res = await apiService.post<{ body?: BonanzaEntriesResult }>(
    API_CONSTANT.TENANT.PROCESS_MISSING_BONANZA_ENTRIES,
    { body: { tenantId } }
  );
  const data = res.data?.body ?? res.data;
  return data as BonanzaEntriesResult;
}

export async function updateWebhook(baseUrl: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.WEBHOOK.CREATE_UPDATE, { body: { baseUrl } });
  return res.data;
}

export async function makeTenantPublic(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.REMOVE_CONSTRAINTS, { body: { tenantId } });
  return res.data;
}

export async function makeTenantPrivate(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.ADD_CONSTRAINTS, { body: { tenantId } });
  return res.data;
}

export async function stopTenant(tenantId: string, apiKey?: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.STOP, { body: { tenantId, apiKey } });
  return res.data;
}

export async function restartTenant(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.RESTART, { body: { tenantId } });
  return res.data;
}

export async function sendWelcomeEmail(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.WELCOM_EMAIL_SEND, { body: { tenantId } });
  return res.data;
}

export async function updateTenantEmail(tenantId: string, email: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.UPDATE_EMAIL, { body: { tenantId, email } });
  return res.data;
}

export async function setupTenantSSL(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.SETUP_SSH, { body: { tenantId } });
  return res.data;
}

export async function updateTenant3PL(tenantId: string, threePL: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.UPDATE_THREEPL, { body: { tenantId, threePL } });
  return res.data;
}

export async function bPlannedProvision(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.TENANT.BPLANNED_PROVISION, { body: { tenantId } });
  return res.data;
}

export async function approveCancelRequest(tenantId: string): Promise<unknown> {
  const res = await apiService.post(`${API_CONSTANT.TENANT.CANCEL_REQUEST}/${tenantId}/approve`, { body: {} });
  return res.data;
}

export async function qa3CancelInitiate(tenantId: string): Promise<unknown> {
  const res = await apiService.post(
    `${API_CONSTANT.TENANT.QA3_CANCEL_REQUEST}/${tenantId}/initiate`,
    { body: {} }
  );
  return res.data;
}

export async function qa3CancelApprove(tenantId: string): Promise<unknown> {
  const res = await apiService.post(
    `${API_CONSTANT.TENANT.QA3_CANCEL_REQUEST}/${tenantId}/approve`,
    { body: {} }
  );
  return res.data;
}

export async function bankeloOnboarding(tenantId: string): Promise<unknown> {
  const res = await apiService.post(API_CONSTANT.BANKELO.ONBOARDING, { body: { tenantId } });
  return res.data;
}

export async function bankeloOnboardingDocument(tenantId: string, documentType: string): Promise<unknown> {
  const res = await apiService.post(`${API_CONSTANT.BANKELO.ONBOARDING_DOCUMENT}/${tenantId}/${documentType}`, { body: {} });
  return res.data;
}

export async function uploadAppleVerificationFile(tenantId: string, file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append('appleVerificationFile', file);
  const res = await apiService.post(API_CONSTANT.TENANT.APPLE_VERIFICATION_FILE_UPLOAD, {
    body: formData,
    header: { tenantId },
  });
  return res.data;
}
