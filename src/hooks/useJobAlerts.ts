import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { ApiJobAlert, JobAlertFrequency, DjangoPaginatedResponse } from '@/types';

const KEY = ['job-alerts'] as const;

export function useJobAlerts() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => {
      const res = await apiService.get<DjangoPaginatedResponse<ApiJobAlert> | ApiJobAlert[]>('/job-alerts/');
      // Handle both paginated { results: [...] } and plain array responses
      return Array.isArray(res) ? res : res.results;
    },
  });
}

export function useCreateJobAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { filters?: Record<string, unknown>; frequency?: JobAlertFrequency }) =>
      apiService.post<ApiJobAlert>('/job-alerts/', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateJobAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ filters: Record<string, unknown>; frequency: JobAlertFrequency; is_active: boolean }>;
    }) => apiService.patch<ApiJobAlert>(`/job-alerts/${id}/`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteJobAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/job-alerts/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
    },
  });
}
