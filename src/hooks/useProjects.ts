import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { projectService } from '@/services/project.service';
import type { ApiProjectDetail, ApiProjectCreateRequest, ApiProjectPatchRequest } from '@/types';

interface ProjectFilters {
  search?: string;
  category?: string;
  page?: number;
}

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectService.getProjects(filters),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
  });
}

export function useMyProjects(page = 1) {
  return useQuery({
    queryKey: ['my-projects', page],
    queryFn: () => projectService.getProjects({ page }),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApiProjectCreateRequest) =>
      apiService.post<ApiProjectDetail>('/projects/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApiProjectPatchRequest }) =>
      apiService.patch<ApiProjectDetail>(`/projects/${id}/`, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.delete<void>(`/projects/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
    },
  });
}

export function useSubmitProjectForReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiService.post<ApiProjectDetail>(`/projects/${id}/submit_for_review/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-projects'] });
    },
  });
}
