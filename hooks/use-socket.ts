'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useSocketStore } from '@/stores/socket-store';
import {
  getSocket,
  connectSocket,
  disconnectSocket,
  waitForConnection,
} from '@/lib/socket';

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

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    connectSocket();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      // Clean up all tracked listeners to prevent memory leaks
      for (const [event, handlers] of listenersRef.current.entries()) {
        for (const handler of handlers) {
          socket.off(event, handler);
        }
      }
      listenersRef.current.clear();
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

  /**
   * Emit a socket event. Waits for connection if not yet connected.
   * Returns the server acknowledgment (if any) via Socket.IO callback.
   */
  const emit = useCallback(async (event: string, data?: unknown): Promise<unknown> => {
    try {
      await waitForConnection(5000);
    } catch {
      // Socket not connected — emit anyway (Socket.IO will buffer)
    }
    const socket = getSocket();
    return new Promise((resolve) => {
      socket.emit(event, data, (ack: unknown) => {
        resolve(ack);
      });
      // If server doesn't acknowledge within 10s, resolve with undefined
      setTimeout(() => resolve(undefined), 10000);
    });
  }, []);

  return { isConnected, subscribe, emit };
}
