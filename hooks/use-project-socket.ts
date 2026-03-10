'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from './use-socket';
import { useSocketStore } from '@/stores/socket-store';
import { QUERY_KEYS } from '@/lib/constants';

export function useProjectSocket(projectId: string) {
  const { subscribe, emit } = useSocket();
  const { setProjectRoom } = useSocketStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    emit('join_project', { projectId });
    setProjectRoom(projectId);

    const unsubs = [
      subscribe<{ fileId: string; path: string; projectId: string }>(
        'file:created',
        () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
        }
      ),

      subscribe<{ fileId: string; path: string; projectId: string }>(
        'file:updated',
        () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
        }
      ),

      subscribe<{ fileId: string; path: string; projectId: string }>(
        'file:deleted',
        () => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
        }
      ),

      subscribe<{ messageId: string; role: string; content: string }>(
        'message:received',
        () => {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.CONVERSATIONS(projectId),
          });
        }
      ),
    ];

    return () => {
      emit('leave_project', { projectId });
      setProjectRoom(null);
      unsubs.forEach((unsub) => unsub());
    };
  }, [projectId, emit, subscribe, setProjectRoom, queryClient]);
}
