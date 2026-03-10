'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useSocketStore } from '@/stores/socket-store';
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket';

export function useSocket() {
  const { isAuthenticated } = useAuthStore();
  const { isConnected, setConnected } = useSocketStore();
  const listenersRef = useRef<Map<string, Set<(...args: unknown[]) => void>>>(new Map());

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setConnected(false);
      return;
    }

    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    connectSocket();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [isAuthenticated, setConnected]);

  const subscribe = useCallback(
    <T = unknown>(event: string, handler: (data: T) => void) => {
      const socket = getSocket();
      socket.on(event, handler as (...args: unknown[]) => void);

      if (!listenersRef.current.has(event)) {
        listenersRef.current.set(event, new Set());
      }
      listenersRef.current.get(event)!.add(handler as (...args: unknown[]) => void);

      return () => {
        socket.off(event, handler as (...args: unknown[]) => void);
        listenersRef.current.get(event)?.delete(handler as (...args: unknown[]) => void);
      };
    },
    []
  );

  const emit = useCallback((event: string, data?: unknown) => {
    const socket = getSocket();
    socket.emit(event, data);
  }, []);

  return { isConnected, subscribe, emit };
}
