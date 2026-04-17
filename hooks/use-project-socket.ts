'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useSocketStore } from '@/stores/socket-store';
import { getSocket } from '@/lib/socket';
import { QUERY_KEYS } from '@/lib/constants';

export function useProjectSocket(projectId: string) {
  const { subscribe, emit, isConnected } = useSocket();
  const { setProjectRoom } = useSocketStore();
  const queryClient = useQueryClient();

  // Join project room on mount and re-join on reconnect
  useEffect(() => {
    emit('join_project', { projectId });
    setProjectRoom(projectId);

    // Re-join project room after reconnection (socket rooms are lost on disconnect)
    const socket = getSocket();
    const onReconnect = () => {
      emit('join_project', { projectId });
    };
    socket.on('connect', onReconnect);

    return () => {
      socket.off('connect', onReconnect);
    };
  }, [projectId, emit, setProjectRoom]);

  useEffect(() => {

    const unsubs = [
      subscribe<{ messageId: string; role: string; content: string; createdAt?: string }>(
        'message:received',
        (data) => {
          // Invalidate conversations list
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.CONVERSATIONS(projectId),
          });
          // Force immediate refetch of ALL active conversation queries
          // This ensures new messages appear immediately in the UI
          queryClient.refetchQueries({
            queryKey: ['conversation'],
            type: 'active',
          });
          // Also invalidate the broader query key to catch any stale queries
          queryClient.invalidateQueries({
            queryKey: ['conversation'],
          });
        }
      ),

      subscribe<{ conversationId: string; title: string }>(
        'conversation:title_updated',
        () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS(projectId) });
          queryClient.refetchQueries({ queryKey: ['conversation'], type: 'active' });
        }
      ),

      subscribe('preview:building', () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId) });
      }),

      subscribe<{ url: string }>('preview:ready', () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId) });
      }),

      subscribe<{ error: string }>('preview:error', () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId) });
      }),
    ];

    return () => {
      emit('leave_project', { projectId });
      setProjectRoom(null);
      unsubs.forEach((unsub) => unsub());
    };
  }, [projectId, emit, subscribe, setProjectRoom, queryClient]);
}
