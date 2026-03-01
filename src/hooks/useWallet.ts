import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  ApiWallet,
  ApiWalletTransaction,
  ApiWithdrawalRequest,
  WithdrawalRequestCreateRequest,
  DjangoPaginatedResponse,
} from '@/types';

const KEYS = {
  wallet: () => ['wallet'] as const,
  transactions: (page: number) => ['wallet', 'transactions', page] as const,
  withdrawals: () => ['wallet', 'withdrawals'] as const,
};

export function useWallet() {
  return useQuery({
    queryKey: KEYS.wallet(),
    queryFn: () => apiService.get<ApiWallet>('/wallet/me/'),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useWalletTransactions(page = 1) {
  return useQuery({
    queryKey: KEYS.transactions(page),
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiWalletTransaction>>(
        `/wallet/transactions/${page > 1 ? `?page=${page}` : ''}`,
      ),
    staleTime: 30_000,
  });
}

export function useWithdrawals() {
  return useQuery({
    queryKey: KEYS.withdrawals(),
    queryFn: () => apiService.get<ApiWithdrawalRequest[]>('/wallet/withdrawals/'),
    staleTime: 30_000,
  });
}

export function useCreateWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WithdrawalRequestCreateRequest) =>
      apiService.post<ApiWithdrawalRequest>('/wallet/withdrawals/', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.wallet() });
      qc.invalidateQueries({ queryKey: ['wallet', 'withdrawals'] });
      qc.invalidateQueries({ queryKey: ['wallet', 'transactions'] });
    },
  });
}
