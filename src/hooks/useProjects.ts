import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { projectService } from '@/services/project.service';
import type { ProjectFilters } from '@/services/project.service';
import type { ApiProjectDetail, ApiProjectCreateRequest, ApiProjectPatchRequest, ApiProjectDocument, ProjectDocumentType } from '@/types';

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

// ── Project Documents ──────────────────────────────────────────────────────────

export function useProjectDocuments(projectId: string) {
  return useQuery({
    queryKey: ['project-documents', projectId],
    queryFn: () => apiService.get<ApiProjectDocument[]>(`/projects/${projectId}/documents/`),
    enabled: !!projectId,
  });
}

export function useUploadProjectDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, doc_type, title }: { file: File; doc_type: ProjectDocumentType; title: string }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('doc_type', doc_type);
      form.append('title', title);
      return apiService.postFormData<ApiProjectDocument>(`/projects/${projectId}/documents/`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
    },
  });
}

export function useDeleteProjectDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (docId: string) =>
      apiService.delete<void>(`/projects/${projectId}/documents/${docId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-documents', projectId] });
    },
  });
}
