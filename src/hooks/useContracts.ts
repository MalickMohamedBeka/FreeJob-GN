import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiContractList,
  ApiContractDetail,
  ContractSummary,
  ApiMilestone,
  MilestoneCreateRequest,
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

export function useContractMilestones(contractId: string) {
  return useQuery({
    queryKey: ['milestones', contractId],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiMilestone>>(`/contracts/${contractId}/milestones/`),
    enabled: !!contractId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, data }: { contractId: string; data: MilestoneCreateRequest }) =>
      apiService.post<ApiMilestone>(`/contracts/${contractId}/milestones/`, data),
    onSuccess: (_data, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-summary'] });
    },
  });
}

export function useDeliverMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiMilestone>(`/milestones/${id}/deliver/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      queryClient.invalidateQueries({ queryKey: ['contract-summary'] });
    },
  });
}

export function useReleaseMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiMilestone>(`/milestones/${id}/release/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      queryClient.invalidateQueries({ queryKey: ['contract-summary'] });
    },
  });
}
