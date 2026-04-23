import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { DjangoPaginatedResponse } from '@/types';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AdminStats {
  generated_at: string;
  users: {
    total: number;
    new_today: number;
    new_this_week: number;
    new_this_month: number;
  };
  projects: {
    total_published: number;
    new_this_week: number;
    proposals_this_week: number;
    contracts_active: number;
    contracts_completed_this_month: number;
  };
  payments: {
    volume_this_month: number;
    success_count_this_month: number;
    failed_count_this_month: number;
  };
  disputes: {
    open: number;
    under_review: number;
    resolved_this_month: number;
  };
  subscriptions: {
    active_total: number;
    by_tier: Record<string, number>;
  };
}

export interface AuditLog {
  id: number;
  user: number | null;
  username: string | null;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string | null;
  extra: Record<string, unknown> | null;
  created_at: string;
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiService.get<AdminStats>('/users/admin/stats/overview/'),
    staleTime: 60 * 1000,
  });
}

export interface AuditLogFilters {
  page?: number;
  action?: string;
  resource_type?: string;
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.page) params.page = String(filters.page);
  if (filters.action) params.action = filters.action;
  if (filters.resource_type) params.resource_type = filters.resource_type;

  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<AuditLog>>('/users/admin/audit-logs/', params),
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason, until }: { userId: number; reason: string; until: string }) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/suspend/`, {
        reason,
        until,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useUnsuspendUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/unsuspend/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/ban/`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/unban/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      resolution,
      resolution_note,
    }: {
      contractId: string;
      resolution: 'client' | 'provider' | 'close';
      resolution_note?: string;
    }) =>
      apiService.post(`/contracts/${contractId}/dispute/resolve/`, {
        resolution,
        resolution_note: resolution_note ?? '',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
  });
}

// ── KYC ───────────────────────────────────────────────────────────────────────

export interface AdminKycPendingProfile {
  id: number;
  user: number;
  username: string;
  kyc_status: string;
  submitted_at: string | null;
}

export function useAdminKycPending() {
  return useQuery({
    queryKey: ['admin-kyc-pending'],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<AdminKycPendingProfile>>(
        '/users/admin/kyc/pending/'
      ),
    retry: false,
  });
}

export interface AdminKycDocument {
  id: number;
  doc_type: string;
  doc_type_display: string;
  file: string | null;
  title: string;
  reference_number: string;
  issued_at: string | null;
  uploaded_at: string;
}

export interface AdminKycAgencyDocument {
  id: number;
  doc_type: string;
  doc_type_display: string;
  file: string | null;
  reference_number: string;
  uploaded_at: string;
}

export interface AdminKycDetail {
  id: number;
  user_id: number;
  username: string;
  email: string;
  provider_kind: 'FREELANCE' | 'AGENCY';
  profile_picture: string | null;
  bio: string;
  hourly_rate: string | null;
  city_or_region: string;
  country: string;
  phone: string;
  years_of_experience: number | null;
  linkedin_url: string;
  website_url: string;
  kyc_status: string;
  kyc_rejection_reason: string;
  submitted_at: string;
  freelance_first_name: string | null;
  freelance_last_name: string | null;
  freelance_business_name: string | null;
  agency_name: string | null;
  agency_founded_at: string | null;
  agency_documents: AdminKycAgencyDocument[];
  documents: AdminKycDocument[];
}

export function useAdminKycDetail(profileId: number | null) {
  return useQuery({
    queryKey: ['admin-kyc-detail', profileId],
    queryFn: () =>
      apiService.get<AdminKycDetail>(`/users/admin/kyc/${profileId}/detail/`),
    enabled: profileId !== null,
    retry: false,
  });
}

export function useAdminKycReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      profileId,
      decision,
      rejection_reason,
    }: {
      profileId: number;
      decision: 'approve' | 'reject';
      rejection_reason?: string;
    }) =>
      apiService.post(`/users/admin/kyc/${profileId}/review/`, {
        decision,
        rejection_reason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kyc-pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

// ── Disputes (liste agrégée) ──────────────────────────────────────────────────

export interface AdminDispute {
  id: string;
  contract: string;
  contract_title: string | null;
  raised_by_username: string;
  status: string;
  status_display: string;
  reason: string;
  created_at: string;
}

export function useAdminDisputeList(page = 1) {
  return useQuery({
    queryKey: ['admin-disputes', page],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<AdminDispute>>(
        '/contracts/admin/disputes/',
        { page: String(page) }
      ),
    retry: false,
  });
}

// ── Admin contract actions ────────────────────────────────────────────────────

export function useAdminCompleteContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) =>
      apiService.post(`/contracts/${contractId}/admin/complete/`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
  });
}

export function useAdminCancelContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) =>
      apiService.post(`/contracts/${contractId}/admin/cancel/`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
  });
}

// ── Ranking maintenance ───────────────────────────────────────────────────────

export function useAdminRankingRecalculate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.post('/rankings/recalculate/', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rankings'] }),
  });
}

export function useAdminRankingSnapshot() {
  return useMutation({
    mutationFn: () => apiService.post('/rankings/calculate-snapshot/', {}),
  });
}

export function useAdminRankingAdjust() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      providerId,
      score_adjustment,
      reason,
    }: {
      providerId: number;
      score_adjustment: number;
      reason: string;
    }) =>
      apiService.post(`/rankings/${providerId}/adjust/`, { score_adjustment, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rankings'] }),
  });
}

// ── Admin User List ───────────────────────────────────────────────────────────

export interface AdminUserItem {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: 'CLIENT' | 'PROVIDER';
  provider_kind: 'FREELANCE' | 'AGENCY' | null;
  is_active: boolean;
  is_suspended: boolean;
  is_banned: boolean;
  date_joined: string;
}

export function useAdminUserList(params: { page?: number; search?: string } = {}) {
  const queryParams: Record<string, string> = {};
  if (params.page && params.page > 1) queryParams.page = String(params.page);
  if (params.search) queryParams.search = params.search;

  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<AdminUserItem>>('/users/admin/users/', queryParams),
    retry: false,
  });
}
