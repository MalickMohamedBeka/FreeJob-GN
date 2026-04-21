/**
 * Freelancer Service
 * Real API calls for freelancer operations
 */

import { apiService } from './api.service';
import type { ApiFreelancerProfile, ApiProviderDiscovery, DjangoPaginatedResponse } from '@/types';

interface FreelancerFilters {
  city?: string;
  country?: string;
  skill_id?: number;
  speciality_id?: number;
  page?: number;
  available?: boolean;
  min_stars?: number;
  provider_kind?: 'FREELANCE' | 'AGENCY';
}

class FreelancerService {
  async getFreelancers(filters?: FreelancerFilters): Promise<DjangoPaginatedResponse<ApiFreelancerProfile>> {
    const params: Record<string, string> = {};
    if (filters?.city) params.city = filters.city;
    if (filters?.country) params.country = filters.country;
    if (filters?.skill_id) params.skill_id = String(filters.skill_id);
    if (filters?.speciality_id) params.speciality_id = String(filters.speciality_id);
    if (filters?.page) params.page = String(filters.page);
    if (filters?.available) params.available = 'true';
    return apiService.get<DjangoPaginatedResponse<ApiFreelancerProfile>>('/users/freelancers/', params);
  }

  async getProviders(filters?: FreelancerFilters): Promise<DjangoPaginatedResponse<ApiProviderDiscovery>> {
    const params: Record<string, string> = {};
    if (filters?.city) params.city = filters.city;
    if (filters?.country) params.country = filters.country;
    if (filters?.skill_id) params.skill_id = String(filters.skill_id);
    if (filters?.speciality_id) params.speciality_id = String(filters.speciality_id);
    if (filters?.page) params.page = String(filters.page);
    if (filters?.available) params.available = 'true';
    if (filters?.min_stars !== undefined) params.min_stars = String(filters.min_stars);
    if (filters?.provider_kind) params.provider_kind = filters.provider_kind;
    return apiService.get<DjangoPaginatedResponse<ApiProviderDiscovery>>('/users/providers/', params);
  }

  async getFreelancerById(id: number): Promise<ApiFreelancerProfile> {
    return apiService.get<ApiFreelancerProfile>(`/users/freelancers/${id}/`);
  }
}

export const freelancerService = new FreelancerService();
