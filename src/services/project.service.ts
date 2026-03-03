/**
 * Project Service
 * Real API calls for project operations
 */

import { apiService } from './api.service';
import type { ApiProjectList, ApiProjectDetail, DjangoPaginatedResponse } from '@/types';

export interface ProjectFilters {
  search?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  skill_ids?: number[];
  speciality_id?: number;
  page?: number;
}

class ProjectService {
  async getProjects(filters?: ProjectFilters): Promise<DjangoPaginatedResponse<ApiProjectList>> {
    // Build URLSearchParams directly to support multi-value skill params (?skill=1&skill=2)
    const sp = new URLSearchParams();
    if (filters?.search) sp.set('search', filters.search);
    if (filters?.category) sp.set('category_name', filters.category);
    if (filters?.budget_min) sp.set('budget_min', String(filters.budget_min));
    if (filters?.budget_max) sp.set('budget_max', String(filters.budget_max));
    if (filters?.page && filters.page > 1) sp.set('page', String(filters.page));
    if (filters?.speciality_id) sp.set('speciality', String(filters.speciality_id));
    filters?.skill_ids?.forEach((id) => sp.append('skill', String(id)));

    const qs = sp.toString();
    return apiService.get<DjangoPaginatedResponse<ApiProjectList>>(
      qs ? `/projects/?${qs}` : '/projects/',
    );
  }

  async getProjectById(id: string): Promise<ApiProjectDetail> {
    return apiService.get<ApiProjectDetail>(`/projects/${id}/`);
  }
}

export const projectService = new ProjectService();
