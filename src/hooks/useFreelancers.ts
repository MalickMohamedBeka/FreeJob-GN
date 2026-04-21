import { useQuery } from '@tanstack/react-query';
import { freelancerService } from '@/services/freelancer.service';

interface FreelancerFilters {
  page?: number;
  skill_id?: number;
  speciality_id?: number;
  city?: string;
  available?: boolean;
  min_stars?: number;
  provider_kind?: 'FREELANCE' | 'AGENCY';
}

export function useFreelancers(filters?: FreelancerFilters) {
  return useQuery({
    queryKey: ['freelancers', filters],
    queryFn: () => freelancerService.getFreelancers(filters),
  });
}

export function useProviders(filters?: FreelancerFilters) {
  return useQuery({
    queryKey: ['providers', filters],
    queryFn: () => freelancerService.getProviders(filters),
  });
}

export function useFreelancer(id: number) {
  return useQuery({
    queryKey: ['freelancer', id],
    queryFn: () => freelancerService.getFreelancerById(id),
    enabled: !!id,
  });
}
