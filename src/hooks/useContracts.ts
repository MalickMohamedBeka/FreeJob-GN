import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiContractList,
  ApiContractDetail,
  ApiDeliverable,
  ApiDispute,
  ContractSummary,
  DjomyGatewayPaymentRequest,
  DjomyGatewayPaymentResponse,
  DjomyPaymentStatus,
  DjomyConfirmOTPRequest,
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

export function useInitiatePayment() {
  return useMutation({
    mutationFn: (data: DjomyGatewayPaymentRequest) =>
      apiService.post<DjomyGatewayPaymentResponse>('/payments/djomy/gateway/', data),
  });
}

export function useCheckTransactionStatus(transactionId: string, enabled = true) {
  return useQuery({
    queryKey: ['transaction-status', transactionId],
    queryFn: () =>
      apiService.get<DjomyPaymentStatus>(`/payments/djomy/transactions/${transactionId}/`),
    enabled: !!transactionId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status) return 5000;
      return status === 'SUCCESS' || status === 'FAILED' || status === 'COMPLETED' ? false : 5000;
    },
  });
}

export function useConfirmOTP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ transactionReference, data }: { transactionReference: string; data: DjomyConfirmOTPRequest }) =>
      apiService.post<void>(`/payments/djomy/transactions/${transactionReference}/otp/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['transaction-status'] });
    },
  });
}

export function useRequestCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) =>
      apiService.post<ApiContractDetail>(`/contracts/${contractId}/request_completion/`),
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
    },
  });
}

export function useConfirmCompletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contractId: string) =>
      apiService.post<ApiContractDetail>(`/contracts/${contractId}/confirm_completion/`),
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['rankings-reviews'] });
    },
  });
}

// ── Deliverables ─────────────────────────────────────────────────────────────

export function useDeliverables(contractId: string, enabled = true) {
  return useQuery({
    queryKey: ['deliverables', contractId],
    queryFn: () => apiService.get<ApiDeliverable[]>(`/contracts/${contractId}/deliverables/`),
    enabled: !!contractId && enabled,
  });
}

export function useSubmitDeliverable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, formData }: { contractId: string; formData: FormData }) =>
      apiService.postFormData<ApiDeliverable>(`/contracts/${contractId}/deliverables/`, formData),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['deliverables', contractId] });
    },
  });
}

export function useAcceptDeliverable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ deliverableId, contractId }: { deliverableId: string; contractId: string }) =>
      apiService.post<ApiDeliverable>(`/deliverables/${deliverableId}/accept/`),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['deliverables', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useRequestDeliverableRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      deliverableId,
      contractId,
      revision_note,
    }: {
      deliverableId: string;
      contractId: string;
      revision_note: string;
    }) =>
      apiService.post<ApiDeliverable>(`/deliverables/${deliverableId}/request-revision/`, {
        revision_note,
      }),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['deliverables', contractId] });
    },
  });
}

// ── Revision ─────────────────────────────────────────────────────────────────

export function useRequestRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, note }: { contractId: string; note: string }) =>
      apiService.post<ApiContractDetail>(`/contracts/${contractId}/request_revision/`, { note }),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
    },
  });
}

// ── Dispute ──────────────────────────────────────────────────────────────────

export function useDispute(contractId: string) {
  return useQuery({
    queryKey: ['dispute', contractId],
    queryFn: () => apiService.get<ApiDispute>(`/contracts/${contractId}/dispute/`),
    enabled: !!contractId,
    retry: (failureCount, error: any) => {
      // 404 = pas de litige → ne pas retenter
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useOpenDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, reason }: { contractId: string; reason: string }) =>
      apiService.post<ApiDispute>(`/contracts/${contractId}/dispute/`, { reason }),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['dispute', contractId] });
    },
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contractId,
      resolution,
      note,
    }: {
      contractId: string;
      resolution: 'client' | 'provider' | 'close';
      note?: string;
    }) =>
      apiService.post<ApiDispute>(`/contracts/${contractId}/dispute/resolve/`, {
        resolution,
        note: note ?? '',
      }),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['dispute', contractId] });
    },
  });
}
