import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  ApiFreelancerProfile,
  ApiFreelanceDocument,
  FreelanceProfilePatchRequest,
  DjangoPaginatedResponse,
} from '@/types';

export function useFreelanceProfile() {
  return useQuery({
    queryKey: ['freelance-profile'],
    queryFn: () => apiService.get<ApiFreelancerProfile>('/users/freelance/profile/'),
  });
}

export function useUpdateFreelanceProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FreelanceProfilePatchRequest) =>
      apiService.patch<ApiFreelancerProfile>('/users/freelance/profile/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelance-profile'] });
    },
  });
}

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('profile_picture', file);
      return apiService.patchFormData<ApiFreelancerProfile>('/users/freelance/profile/', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelance-profile'] });
    },
  });
}

export function useFreelanceDocuments() {
  return useQuery({
    queryKey: ['freelance-documents'],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiFreelanceDocument>>('/users/freelance/documents/'),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiService.postFormData<ApiFreelanceDocument>('/users/freelance/documents/', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelance-documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.delete<void>(`/users/freelance/documents/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freelance-documents'] });
    },
  });
}

export function useClientProfile() {
  return useQuery({
    queryKey: ['client-profile'],
    queryFn: () => apiService.get('/users/client/profile/'),
  });
}
