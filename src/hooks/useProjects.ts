import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';

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
