'use client';

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSocket } from './use-socket';
import { useChatStore } from '@/stores/chat-store';
import type { FileOperation } from '@/stores/chat-store';
import { QUERY_KEYS } from '@/lib/constants';

interface ChunkPayload {
  conversationId: string;
  chunk: string;
  fileOperation?: FileOperation;
}

export function useChatStream(projectId?: string) {
  const { subscribe, emit } = useSocket();
  const queryClient = useQueryClient();
  const {
    isStreaming,
    streamingContent,
    streamingConversationId,
    fileOperations,
    startStreaming,
    appendChunk,
    addFileOperation,
    endStreaming,
  } = useChatStore();

  useEffect(() => {
    const unsubs = [
      subscribe<{ conversationId: string }>(
        'chat:response_start',
        (data) => {
          startStreaming(data.conversationId);
        },
      ),

      subscribe<ChunkPayload>(
        'chat:response_chunk',
        (data) => {
          if (data.chunk) {
            appendChunk(data.chunk);
          }
          if (data.fileOperation) {
            addFileOperation(data.fileOperation);
            // Invalidate files query so file explorer refreshes
            if (projectId) {
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FILES(projectId),
              });
              // Also invalidate individual file queries so open editors refresh
              queryClient.invalidateQueries({
                queryKey: ['file', projectId],
              });
            }
          }
        },
      ),

      subscribe<{ conversationId: string; messageId: string; content: string }>(
        'chat:response_end',
        (data) => {
          endStreaming();
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.CONVERSATION(data.conversationId),
          });
          queryClient.invalidateQueries({ queryKey: ['conversation'] });
          // Final files refresh
          if (projectId) {
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.FILES(projectId),
            });
          }
        },
      ),

      subscribe<{ conversationId: string; error: string }>(
        'chat:response_error',
        (data) => {
          endStreaming();
          toast.error(data.error || 'AI response failed. Please try again.');
        },
      ),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [subscribe, startStreaming, appendChunk, addFileOperation, endStreaming, queryClient, projectId]);

  const { selectedModel, planMode } = useChatStore();

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      // Optimistically invalidate the conversation query so it refetches immediately
      // This ensures the user's message appears in the UI right away
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CONVERSATION(conversationId),
      });

      const ack = await emit('send_message', {
        conversationId,
        content,
        model: selectedModel,
        planMode,
      });

      // Server returns { status: 'ok' } or { status: 'error', error: '...' }
      if (ack && typeof ack === 'object' && 'status' in ack) {
        const ackData = ack as { status: string; error?: string };
        if (ackData.status === 'error') {
          toast.error(ackData.error || 'Failed to send message');
        }
      }
    },
    [emit, selectedModel, planMode, queryClient],
  );

  return {
    sendMessage,
    isStreaming,
    streamingContent,
    streamingConversationId,
    fileOperations,
  };
}