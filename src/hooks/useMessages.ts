import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import type { ApiConversation, ApiMessage, DjangoPaginatedResponse } from '@/types';

export function useConversation(proposalId: string) {
  return useQuery({
    queryKey: ['conversation', proposalId],
    queryFn: () =>
      apiService.get<ApiConversation>(`/proposals/${proposalId}/conversation/`),
    enabled: !!proposalId,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () =>
      apiService.get<DjangoPaginatedResponse<ApiMessage>>(
        `/conversations/${conversationId}/messages/`,
      ),
    enabled: !!conversationId,
    refetchInterval: 5000, // poll every 5 seconds
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      apiService.post(`/conversations/${conversationId}/messages/`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });
}
