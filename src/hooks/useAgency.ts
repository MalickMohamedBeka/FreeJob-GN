import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  ApiAgencyProfile,
  ApiAgencyDocument,
  AgencyProfileInitRequest,
  AgencyProfilePatchRequest,
  DjangoPaginatedResponse,
} from '@/types';

const PROFILE_KEY = ['agency-profile'] as const;
const DOCS_KEY = ['agency-documents'] as const;

interface AgencyFilters {
  page?: number;
  country?: string;
  city?: string;
  speciality_id?: number;
  skill_id?: number;
}

// ── My agency profile (authenticated) ─────────────────────────────────────────

export function useMyAgencyProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => apiService.get<ApiAgencyProfile>('/users/agency/profile/'),
    retry: false,
  });
}

export function useInitAgencyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgencyProfileInitRequest) =>
      apiService.post<ApiAgencyProfile>('/users/agency/profile/init/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
}

export function useUpdateAgencyProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AgencyProfilePatchRequest) =>
      apiService.patch<ApiAgencyProfile>('/users/agency/profile/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
}

export function useUpdateAgencyProfilePicture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, agency_name }: { file: File; agency_name: string }) => {
      const formData = new FormData();
      formData.append('profile_picture', file);
      formData.append('agency', JSON.stringify({ agency_name }));
      return apiService.patchFormData<ApiAgencyProfile>('/users/agency/profile/', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
    },
  });
}

// ── Agency documents ────────────────────────────────────────────────────────────

export function useAgencyDocuments() {
  return useQuery({
    queryKey: DOCS_KEY,
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiAgencyDocument>>('/users/agency/documents/'),
  });
}

export function useUploadAgencyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiService.postFormData<ApiAgencyDocument>('/users/agency/documents/', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCS_KEY });
    },
  });
}

export function useDeleteAgencyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiService.delete<void>(`/users/agency/documents/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCS_KEY });
    },
  });
}

// ── Public agency discovery ─────────────────────────────────────────────────────

export function useAgencies(filters?: AgencyFilters) {
  return useQuery({
    queryKey: ['agencies', filters],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters?.page) params.page = String(filters.page);
      if (filters?.country) params.country = filters.country;
      if (filters?.city) params.city = filters.city;
      if (filters?.speciality_id) params.speciality_id = String(filters.speciality_id);
      if (filters?.skill_id) params.skill_id = String(filters.skill_id);
      return apiService.get<DjangoPaginatedResponse<ApiAgencyProfile>>('/users/agencies/', params);
    },
  });
}

export function useAgency(id: number | undefined) {
  return useQuery({
    queryKey: ['agency', id],
    queryFn: () => apiService.get<ApiAgencyProfile>(`/users/agencies/${id}/`),
    enabled: !!id,
  });
}
