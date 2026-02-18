import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  ApiFreelancerProfile,
  ApiFreelanceDocument,
  FreelanceProfilePatchRequest,
  DjangoPaginatedResponse,
  ApiClientProfile,
  ClientProfileCreateRequest,
  PatchedClientProfileUpdateRequest,
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
    mutationFn: ({
      file,
      freelance,
    }: {
      file: File;
      freelance: { first_name: string; last_name: string; business_name?: string };
    }) => {
      const formData = new FormData();
      formData.append('profile_picture', file);
      // Include freelance nested data so the backend serializer doesn't crash
      // on a partial update that contains only a file field.
      formData.append('freelance', JSON.stringify(freelance));
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
    queryFn: () => apiService.get<ApiClientProfile>('/users/client/profile/'),
  });
}

export function useCreateClientProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClientProfileCreateRequest) =>
      apiService.post<ApiClientProfile>('/users/client/profile/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-profile'] });
    },
  });
}

export function useUpdateClientProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatchedClientProfileUpdateRequest) =>
      apiService.patch<ApiClientProfile>('/users/client/profile/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-profile'] });
    },
  });
}
