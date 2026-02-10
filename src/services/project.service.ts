/**
 * Project Service
 * Business logic for project operations
 */

import { apiService } from './api.service';
import { mockProjects } from '@/lib/mockData';
import type { Project, PaginatedResponse, FilterParams } from '@/types';

class ProjectService {
  /**
   * Get all projects with optional filters
   * TODO: Replace with real API call
   */
  async getProjects(
    filters?: FilterParams
  ): Promise<PaginatedResponse<Project>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockProjects];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.skills.some((s) => s.toLowerCase().includes(searchLower))
      );
    }

    // Apply skills filter
    if (filters?.skills && filters.skills.length > 0) {
      filtered = filtered.filter((p) =>
        filters.skills!.some((skill) =>
          p.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
        )
      );
    }

    // Apply budget filter
    if (filters?.minBudget !== undefined) {
      filtered = filtered.filter((p) => p.budget.min >= filters.minBudget!);
    }

    if (filters?.maxBudget !== undefined) {
      filtered = filtered.filter((p) => p.budget.max <= filters.maxBudget!);
    }

    return {
      data: filtered,
      total: filtered.length,
      page: 1,
      limit: filtered.length,
      hasMore: false,
    };
  }

  /**
   * Get project by ID
   * TODO: Replace with real API call
   */
  async getProjectById(id: string): Promise<Project | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockProjects.find((p) => p.id === id) || null;
  }

  /**
   * Get recent projects
   */
  async getRecentProjects(limit: number = 6): Promise<Project[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockProjects.slice(0, limit);
  }

  /**
   * Get projects by status
   */
  async getProjectsByStatus(status: string): Promise<Project[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockProjects.filter((p) => p.status === status);
  }
}

export const projectService = new ProjectService();
