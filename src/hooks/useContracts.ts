import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiContractList,
  ApiContractDetail,
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
