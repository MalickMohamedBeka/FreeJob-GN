import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { DjangoPaginatedResponse, ApiPaymentTransaction } from '@/types';

export function usePaymentTransactions(page = 1) {
  return useQuery({
    queryKey: ['payment-transactions', page],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiPaymentTransaction>>(
        '/payments/transactions/',
        { page: String(page) },
      ),
  });
}
