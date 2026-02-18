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

export function useProposalsByProject(projectId: string) {
  return useQuery({
    queryKey: ['proposals', 'project', projectId],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiProposalList>>('/proposals/', {
        project: projectId,
      }),
    enabled: !!projectId,
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

export function useConfirmProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProposalDetail>(`/proposals/${id}/confirm/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useShortlistProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProposalDetail>(`/proposals/${id}/shortlist/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useUnshortlistProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProposalDetail>(`/proposals/${id}/unshortlist/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useSelectProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProposalDetail>(`/proposals/${id}/select/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}

export function useRefuseProposal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProposalDetail>(`/proposals/${id}/refuse/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });
}
