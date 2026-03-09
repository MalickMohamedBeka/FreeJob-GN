import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type {
  DjangoPaginatedResponse,
  ApiProviderRank,
  ApiProviderRankHistory,
  ApiProviderReview,
  ApiProviderReviewCreateRequest,
  ApiPortfolioResponse,
} from '@/types';

export interface RankingFilters {
  category?: string;
  city?: string;
  role?: 'FREELANCE' | 'AGENCY';
  ordering?: 'score' | '-score' | 'position' | '-position';
  page?: number;
}

export function useRankings(filters: RankingFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.category) params.category = filters.category;
  if (filters.city) params.city = filters.city;
  if (filters.role) params.role = filters.role;
  if (filters.ordering) params.ordering = filters.ordering;
  if (filters.page) params.page = String(filters.page);

  return useQuery({
    queryKey: ['rankings', filters],
    queryFn: () =>
      apiService.getPublic<DjangoPaginatedResponse<ApiProviderRank>>('/rankings/', params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProviderRank(providerId: number | undefined) {
  return useQuery({
    queryKey: ['rankings', providerId],
    queryFn: () =>
      apiService.getPublic<ApiProviderRank>(`/rankings/${providerId}/`),
    enabled: !!providerId,
    retry: (count, err) => (err as { status?: number })?.status !== 404 && count < 2,
  });
}

export function useProviderRankHistory(providerId: number | undefined) {
  return useQuery({
    queryKey: ['rankings', providerId, 'history'],
    queryFn: () =>
      apiService.getPublic<DjangoPaginatedResponse<ApiProviderRankHistory>>(
        `/rankings/${providerId}/history/`,
      ),
    enabled: !!providerId,
  });
}

export function useProviderReviews(providerId?: number, page = 1) {
  const params: Record<string, string> = { page: String(page) };
  if (providerId) params.provider = String(providerId);

  return useQuery({
    queryKey: ['rankings-reviews', providerId, page],
    queryFn: () =>
      apiService.getPublic<DjangoPaginatedResponse<ApiProviderReview>>(
        '/rankings/reviews/',
        params,
      ),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApiProviderReviewCreateRequest) =>
      apiService.post<ApiProviderReview>('/rankings/reviews/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankings-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
    },
  });
}

export function usePortfolio(providerId: number | undefined) {
  return useQuery({
    queryKey: ['portfolio', providerId],
    queryFn: () =>
      apiService.getPublic<ApiPortfolioResponse>(`/users/freelancers/${providerId}/portfolio/`),
    enabled: !!providerId,
    retry: (count, err) => (err as { status?: number })?.status !== 404 && count < 2,
    staleTime: 5 * 60 * 1000,
  });
}
