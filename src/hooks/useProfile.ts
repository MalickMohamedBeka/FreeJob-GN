import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  ApiFreelancerProfile,
  ApiFreelanceDocument,
  FreelanceProfilePatchRequest,
  FreelanceDocTypeEnum,
  DjangoPaginatedResponse,
  ApiClientProfile,
  ClientProfileCreateRequest,
  PatchedClientProfileUpdateRequest,
  ApiClientCompanyDocument,
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

export function useClientCompanyDocuments() {
  return useQuery({
    queryKey: ['client-company-documents'],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiClientCompanyDocument>>('/users/client/company/documents/'),
  });
}

export function useUploadClientDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiService.postFormData<ApiClientCompanyDocument>('/users/client/company/documents/', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-company-documents'] });
    },
  });
}

export function useDeleteClientDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiService.delete<void>(`/users/client/company/documents/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-company-documents'] });
    },
  });
}

// ── Freelance document detail + patch ──────────────────────────────────────────

export function useFreelanceDocument(id: number) {
  return useQuery({
    queryKey: ['freelance-document', id],
    queryFn: () => apiService.get<ApiFreelanceDocument>(`/users/freelance/documents/${id}/`),
    enabled: id > 0,
  });
}

export function usePatchFreelanceDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        doc_type?: FreelanceDocTypeEnum;
        file?: File;
        title?: string;
        reference_number?: string;
        issued_at?: string | null;
      };
    }) => {
      const formData = new FormData();
      if (data.doc_type) formData.append('doc_type', data.doc_type);
      if (data.file) formData.append('file', data.file);
      if (data.title !== undefined) formData.append('title', data.title);
      if (data.reference_number !== undefined)
        formData.append('reference_number', data.reference_number);
      if (data.issued_at !== undefined)
        formData.append('issued_at', data.issued_at ?? '');
      return apiService.patchFormData<ApiFreelanceDocument>(
        `/users/freelance/documents/${id}/`,
        formData,
      );
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['freelance-documents'] });
      queryClient.invalidateQueries({ queryKey: ['freelance-document', id] });
    },
  });
}

// ── Client company document detail + patch ─────────────────────────────────────

export function useClientDocument(id: number) {
  return useQuery({
    queryKey: ['client-document', id],
    queryFn: () =>
      apiService.get<ApiClientCompanyDocument>(`/users/client/company/documents/${id}/`),
    enabled: id > 0,
  });
}

export function usePatchClientDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { doc_type?: 'RCCM' | 'LEGAL' | 'OTHER'; reference_number?: string };
    }) =>
      apiService.patch<ApiClientCompanyDocument>(
        `/users/client/company/documents/${id}/`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-company-documents'] });
    },
  });
}
