import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiContractList,
  ApiContractDetail,
  ContractSummary,
} from '@/types';

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

export function useContractSummary(id: string) {
  return useQuery({
    queryKey: ['contract-summary', id],
    queryFn: () => apiService.get<ContractSummary>(`/contracts/${id}/summary/`),
    enabled: !!id,
  });
}

