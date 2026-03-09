import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { ApiSkill, ApiSpeciality, DjangoPaginatedResponse } from '@/types';

export function useAllSkills() {
  return useQuery({
    queryKey: ['taxonomy', 'skills'],
    queryFn: () =>
      apiService.getPublic<DjangoPaginatedResponse<ApiSkill>>('/users/skills/'),
    staleTime: 10 * 60_000, // 10 min — taxonomy rarely changes
  });
}

export function useAllSpecialities() {
  return useQuery({
    queryKey: ['taxonomy', 'specialities'],
    queryFn: () =>
      apiService.getPublic<DjangoPaginatedResponse<ApiSpeciality>>('/users/specialities/'),
    staleTime: 10 * 60_000,
  });
}
