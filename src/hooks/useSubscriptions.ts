import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiSubscriptionPlan,
  ApiSubscription,
  ApiSubscriptionPayment,
  ApiSubscriptionUsage,
  SubscribeRequest,
  SubscribeResponse,
} from '@/types';

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => apiService.get<DjangoPaginatedResponse<ApiSubscriptionPlan>>('/subscriptions/plans/'),
    staleTime: 30 * 60 * 1000,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: ['my-subscription'],
    queryFn: () => apiService.get<ApiSubscription>('/subscriptions/me/'),
    retry: (count, err) => (err as { status?: number })?.status !== 404 && count < 2,
  });
}

export function useSubscriptionUsage() {
  return useQuery({
    queryKey: ['subscription-usage'],
    queryFn: () => apiService.get<DjangoPaginatedResponse<ApiSubscriptionUsage>>('/subscriptions/usage/'),
  });
}

export function useSubscriptionPayments() {
  return useQuery({
    queryKey: ['subscription-payments'],
    queryFn: () => apiService.get<DjangoPaginatedResponse<ApiSubscriptionPayment>>('/subscriptions/payments/'),
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: (data: SubscribeRequest) =>
      apiService.post<SubscribeResponse>('/subscriptions/subscribe/', data),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.post<ApiSubscription>('/subscriptions/cancel/'),
    onSuccess: (updated) => {
      // Write the returned subscription directly into the cache so the UI
      // reflects the cancellation instantly without waiting for a refetch.
      queryClient.setQueryData(['my-subscription'], updated);
    },
  });
}
