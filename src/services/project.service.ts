/**
 * Project Service
 * Real API calls for project operations
 */

import { apiService } from './api.service';
import type { ApiProjectList, ApiProjectDetail, DjangoPaginatedResponse } from '@/types';

interface ProjectFilters {
  search?: string;
  category?: string;
  budget_min?: number;
  budget_max?: number;
  skill?: number[];
  page?: number;
}

class ProjectService {
  async getProjects(filters?: ProjectFilters): Promise<DjangoPaginatedResponse<ApiProjectList>> {
    const params: Record<string, string> = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category_name = filters.category;
    if (filters?.budget_min) params.budget_min = String(filters.budget_min);
    if (filters?.budget_max) params.budget_max = String(filters.budget_max);
    if (filters?.page) params.page = String(filters.page);
    if (filters?.skill?.length) {
      filters.skill.forEach(s => params[`skill`] = String(s));
    }
    return apiService.get<DjangoPaginatedResponse<ApiProjectList>>('/projects/', params);
  }

  async getProjectById(id: string): Promise<ApiProjectDetail> {
    return apiService.get<ApiProjectDetail>(`/projects/${id}/`);
  }
}

export const projectService = new ProjectService();
