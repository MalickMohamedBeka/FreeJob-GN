import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  NotificationListResponse,
  ApiNotification,
  ApiNotificationPreference,
  ApiNotificationTypeInfo,
} from '@/types';

const KEYS = {
  list: (params?: NotificationListParams) => ['notifications', params] as const,
  unreadCount: () => ['notifications', { is_read: false }] as const,
  preferences: () => ['notifications', 'preferences'] as const,
  types: () => ['notifications', 'types'] as const,
};

interface NotificationListParams {
  is_read?: boolean;
  type?: string;
  page?: number;
}

function buildQuery(params?: NotificationListParams) {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.is_read !== undefined) q.set('is_read', String(params.is_read));
  if (params.type) q.set('type', params.type);
  if (params.page && params.page > 1) q.set('page', String(params.page));
  const str = q.toString();
  return str ? `?${str}` : '';
}

export function useNotifications(params?: NotificationListParams) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: () =>
      apiService.get<NotificationListResponse>(
        `/notifications/${buildQuery(params)}`,
      ),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useUnreadCount() {
  const { data } = useNotifications({ is_read: false });
  return data?.unread_count ?? data?.count ?? 0;
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiService.post<ApiNotification>(`/notifications/${id}/read/`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.delete(`/notifications/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead(type?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => {
      const q = type ? `?type=${type}` : '';
      return apiService.post<{ count: number }>(`/notifications/read-all/${q}`, {});
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: KEYS.preferences(),
    queryFn: () =>
      apiService.get<ApiNotificationPreference>('/notifications/preferences/'),
    staleTime: 5 * 60_000,
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ApiNotificationPreference>) =>
      apiService.put<ApiNotificationPreference>(
        '/notifications/preferences/',
        data,
      ),
    onSuccess: (updated) => {
      qc.setQueryData(KEYS.preferences(), updated);
    },
  });
}

export function useResetNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiService.post<ApiNotificationPreference>(
        '/notifications/preferences/reset/',
        {},
      ),
    onSuccess: (updated) => {
      qc.setQueryData(KEYS.preferences(), updated);
    },
  });
}

export function useNotificationTypes() {
  return useQuery({
    queryKey: KEYS.types(),
    queryFn: () =>
      apiService.get<ApiNotificationTypeInfo[]>('/notifications/types/'),
    staleTime: Infinity,
  });
}
