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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
  });
}

export function useUnsuspendUser() {
  return useMutation({
    mutationFn: (userId: number) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/unsuspend/`),
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/ban/`, { reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-stats'] }),
  });
}

export function useUnbanUser() {
  return useMutation({
    mutationFn: (userId: number) =>
      apiService.post<{ detail: string }>(`/users/admin/users/${userId}/unban/`),
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
