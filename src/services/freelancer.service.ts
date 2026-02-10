/**
 * Freelancer Service
 * Business logic for freelancer operations
 */

import { apiService } from './api.service';
import { mockFreelancers } from '@/lib/mockData';
import type { Freelancer, PaginatedResponse, FilterParams } from '@/types';

class FreelancerService {
  /**
   * Get all freelancers with optional filters
   * TODO: Replace with real API call
   */
  async getFreelancers(
    filters?: FilterParams
  ): Promise<PaginatedResponse<Freelancer>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...mockFreelancers];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(searchLower) ||
          f.title.toLowerCase().includes(searchLower) ||
          f.skills.some((s) => s.toLowerCase().includes(searchLower))
      );
    }

    // Apply skills filter
    if (filters?.skills && filters.skills.length > 0) {
      filtered = filtered.filter((f) =>
        filters.skills!.some((skill) =>
          f.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
        )
      );
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
   * Get freelancer by ID
   * TODO: Replace with real API call
   */
  async getFreelancerById(id: string): Promise<Freelancer | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockFreelancers.find((f) => f.id === id) || null;
  }

  /**
   * Get top rated freelancers
   */
  async getTopRatedFreelancers(limit: number = 5): Promise<Freelancer[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockFreelancers]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Search freelancers by skill
   */
  async searchBySkill(skill: string): Promise<Freelancer[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockFreelancers.filter((f) =>
      f.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
    );
  }
}

export const freelancerService = new FreelancerService();
