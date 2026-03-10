'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as conversationsApi from '@/lib/api/conversations.api';
import { QUERY_KEYS } from '@/lib/constants';
import type { CreateConversationRequest, CreateMessageRequest, PaginationParams } from '@/types';

export function useConversations(projectId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONVERSATIONS(projectId), params],
    queryFn: () => conversationsApi.getConversations(projectId, params),
    enabled: !!projectId,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CONVERSATION(id),
    queryFn: () => conversationsApi.getConversation(id),
    enabled: !!id,
  });
}

export function useCreateConversation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: CreateConversationRequest) =>
      conversationsApi.createConversation(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS(projectId) });
    },
    onError: () => {
      toast.error('Failed to create conversation');
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: string;
      data: CreateMessageRequest;
    }) => conversationsApi.sendMessage(conversationId, data),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATION(conversationId) });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });
}

export function useDeleteConversation(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => conversationsApi.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS(projectId) });
      toast.success('Conversation deleted');
    },
    onError: () => {
      toast.error('Failed to delete conversation');
    },
  });
}
