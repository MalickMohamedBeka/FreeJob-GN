import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { DjangoPaginatedResponse, ApiSkill, ApiSpeciality } from '@/types';

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => apiService.getPublic<DjangoPaginatedResponse<ApiSkill>>('/users/skills/'),
    staleTime: Infinity,
  });
}

export function useSpecialities() {
  return useQuery({
    queryKey: ['specialities'],
    queryFn: () => apiService.getPublic<DjangoPaginatedResponse<ApiSpeciality>>('/users/specialities/'),
    staleTime: Infinity,
  });
}

export function useSkillsBySpeciality(specialityId: number | null) {
  return useQuery({
    queryKey: ['speciality', specialityId, 'skills'],
    queryFn: () => apiService.getPublic<ApiSpeciality>(`/users/specialities/${specialityId}/`),
    enabled: specialityId !== null,
    staleTime: Infinity,
  });
}
