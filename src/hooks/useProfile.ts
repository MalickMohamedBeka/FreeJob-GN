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
  ApiPortfolioItemCustom,
  ApiCertification,
  ApiFavorite,
} from '@/types';

export function useFreelanceProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['freelance-profile'],
    queryFn: () => apiService.get<ApiFreelancerProfile>('/users/freelance/profile/'),
    enabled: options?.enabled ?? true,
    retry: (count, err) => {
      const status = (err as { status?: number })?.status;
      return status !== 403 && status !== 404 && count < 2;
    },
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

// ── Portfolio items personnels ─────────────────────────────────────────────────

export function usePortfolioItems(providerId: number | undefined) {
  return useQuery({
    queryKey: ['portfolio-items', providerId],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiPortfolioItemCustom>>(
        `/users/providers/${providerId}/portfolio-items/`,
      ),
    enabled: !!providerId,
  });
}

export function useCreatePortfolioItem(providerId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiService.postFormData<ApiPortfolioItemCustom>(
        `/users/providers/${providerId}/portfolio-items/`,
        formData,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items', providerId] });
    },
  });
}

export function usePatchPortfolioItem(providerId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiService.patchFormData<ApiPortfolioItemCustom>(
        `/users/providers/${providerId}/portfolio-items/${id}/`,
        formData,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items', providerId] });
    },
  });
}

export function useDeletePortfolioItem(providerId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiService.delete<void>(`/users/providers/${providerId}/portfolio-items/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items', providerId] });
    },
  });
}

// ── Certifications ─────────────────────────────────────────────────────────────

export function useCertifications(providerId: number | undefined) {
  return useQuery({
    queryKey: ['certifications', providerId],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiCertification>>(
        `/users/providers/${providerId}/certifications/`,
      ),
    enabled: !!providerId,
  });
}

export function useCreateCertification(providerId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiService.postFormData<ApiCertification>(
        `/users/providers/${providerId}/certifications/`,
        formData,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications', providerId] });
    },
  });
}

export function usePatchCertification(providerId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiService.patchFormData<ApiCertification>(
        `/users/providers/${providerId}/certifications/${id}/`,
        formData,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications', providerId] });
    },
  });
}

export function useDeleteCertification(providerId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiService.delete<void>(`/users/providers/${providerId}/certifications/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications', providerId] });
    },
  });
}

// ── Favoris providers (clients uniquement) ────────────────────────────────────

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiFavorite>>('/users/me/favorites/'),
    enabled,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      apiService.post<ApiFavorite>(`/users/${userId}/favorite/`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) =>
      apiService.delete<void>(`/users/${userId}/favorite/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}


// ── Profil public client ──────────────────────────────────────────────────────

export function useClientPublicProfile(clientId: number | undefined) {
  return useQuery({
    queryKey: ['client-public-profile', clientId],
    queryFn: () =>
      apiService.get<ApiClientProfile>(`/users/clients/${clientId}/profile/`),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
    retry: (count, err) => (err as { status?: number })?.status !== 404 && count < 2,
  });
}
