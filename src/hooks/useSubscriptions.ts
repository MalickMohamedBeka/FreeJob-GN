import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiSubscriptionPlan,
  ApiSubscription,
  ApiSubscriptionPayment,
  ApiSubscriptionUsage,
  SubscribeRequest,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubscribeRequest) =>
      apiService.post<ApiSubscription>('/subscriptions/subscribe/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-payments'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.post<ApiSubscription>('/subscriptions/cancel/'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
    },
  });
}
