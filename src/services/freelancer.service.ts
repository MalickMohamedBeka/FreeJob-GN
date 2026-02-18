/**
 * Freelancer Service
 * Real API calls for freelancer operations
 */

import { apiService } from './api.service';
import type { ApiFreelancerProfile, DjangoPaginatedResponse } from '@/types';

interface FreelancerFilters {
  city?: string;
  country?: string;
  skill_id?: number;
  speciality_id?: number;
  page?: number;
}

class FreelancerService {
  async getFreelancers(filters?: FreelancerFilters): Promise<DjangoPaginatedResponse<ApiFreelancerProfile>> {
    const params: Record<string, string> = {};
    if (filters?.city) params.city = filters.city;
    if (filters?.country) params.country = filters.country;
    if (filters?.skill_id) params.skill_id = String(filters.skill_id);
    if (filters?.speciality_id) params.speciality_id = String(filters.speciality_id);
    if (filters?.page) params.page = String(filters.page);
    return apiService.get<DjangoPaginatedResponse<ApiFreelancerProfile>>('/users/freelancers/', params);
  }

  async getFreelancerById(id: number): Promise<ApiFreelancerProfile> {
    return apiService.get<ApiFreelancerProfile>(`/users/freelancers/${id}/`);
  }
}

export const freelancerService = new FreelancerService();
