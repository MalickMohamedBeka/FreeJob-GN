import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { ApiFreelancerProfile } from '@/types';

export function useFreelanceProfile() {
  return useQuery({
    queryKey: ['freelance-profile'],
    queryFn: () => apiService.get<ApiFreelancerProfile>('/users/freelance/profile/'),
  });
}

export function useUpdateFreelanceProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ApiFreelancerProfile>) =>
      apiService.patch<ApiFreelancerProfile>('/users/freelance/profile/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelance-profile'] });
    },
  });
}

export function useClientProfile() {
  return useQuery({
    queryKey: ['client-profile'],
    queryFn: () => apiService.get('/users/client/profile/'),
  });
}
