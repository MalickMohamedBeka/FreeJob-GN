import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { DjangoPaginatedResponse, ApiProposalList, ApiProposalDetail, ApiProposalCreateRequest } from '@/types';

export function useProposals(page = 1) {
  return useQuery({
    queryKey: ['proposals', page],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiProposalList>>('/proposals/', {
        page: String(page),
      }),
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApiProposalCreateRequest) =>
      apiService.post<ApiProposalDetail>('/proposals/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useWithdrawProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProposalDetail>(`/proposals/${id}/withdraw/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}
