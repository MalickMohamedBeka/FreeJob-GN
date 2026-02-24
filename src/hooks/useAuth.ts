import { useQuery, useMutation } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  PublicStats,
  RegistrationOptions,
  ActivationResponse,
  ResendActivationRequest,
} from '@/types';

export function usePublicStats() {
  return useQuery({
    queryKey: ['public-stats'],
    queryFn: () => apiService.getPublic<PublicStats>('/users/public/stats/'),
    staleTime: 10 * 60 * 1000, // 10 min
  });
}

export function useRegistrationOptions() {
  return useQuery({
    queryKey: ['registration-options'],
    queryFn: () => apiService.getPublic<RegistrationOptions>('/users/register/options/'),
    staleTime: Infinity,
  });
}

export function useResendActivation() {
  return useMutation({
    mutationFn: (data: ResendActivationRequest) =>
      apiService.postPublic<ActivationResponse>('/users/resend-activation/', data),
  });
}
