import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { DjangoPaginatedResponse, ApiContractList, ApiContractDetail } from '@/types';

export function useContracts(page = 1) {
  return useQuery({
    queryKey: ['contracts', page],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiContractList>>('/contracts/', {
        page: String(page),
      }),
  });
}

export function useContractDetail(id: string) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: () => apiService.get<ApiContractDetail>(`/contracts/${id}/`),
    enabled: !!id,
  });
}
