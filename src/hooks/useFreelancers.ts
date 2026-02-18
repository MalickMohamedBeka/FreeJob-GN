import { useQuery } from '@tanstack/react-query';
import { freelancerService } from '@/services/freelancer.service';

interface FreelancerFilters {
  page?: number;
  skill_id?: number;
  city?: string;
}

export function useFreelancers(filters?: FreelancerFilters) {
  return useQuery({
    queryKey: ['freelancers', filters],
    queryFn: () => freelancerService.getFreelancers(filters),
  });
}

export function useFreelancer(id: number) {
  return useQuery({
    queryKey: ['freelancer', id],
    queryFn: () => freelancerService.getFreelancerById(id),
    enabled: !!id,
  });
}
