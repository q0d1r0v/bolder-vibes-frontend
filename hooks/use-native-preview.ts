'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSocket } from './use-socket';
import {
  getNativePreviewStatus,
  startNativePreview,
  stopNativePreview,
  type NativePreviewState,
} from '@/lib/api/native-preview.api';

const NATIVE_PREVIEW_KEY = (projectId: string) => [
  'native-preview-status',
  projectId,
];

/**
 * Lifecycle hook for the "scan on phone" flow. Mirrors `useApkBuild`
 * but targets `native-preview.service.ts` on the backend which spawns
 * `expo start --tunnel` and captures the `exp://` URL the Expo Go
 * app can open.
 */
export function useNativePreview(projectId: string) {
  const { subscribe } = useSocket();
  const queryClient = useQueryClient();

  const { data: state } = useQuery({
    queryKey: NATIVE_PREVIEW_KEY(projectId),
    queryFn: () => getNativePreviewStatus(projectId),
    enabled: !!projectId,
  });

  const start = useMutation({
    mutationFn: () => startNativePreview(projectId),
    onSuccess: (data) => {
      queryClient.setQueryData<NativePreviewState>(
        NATIVE_PREVIEW_KEY(projectId),
        data,
      );
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to start phone preview';
      toast.error(message);
    },
  });

  const stop = useMutation({
    mutationFn: () => stopNativePreview(projectId),
    onSuccess: () => {
      queryClient.setQueryData<NativePreviewState>(
        NATIVE_PREVIEW_KEY(projectId),
        {
          projectId,
          status: 'idle',
        },
      );
    },
    onError: () => toast.error('Failed to stop phone preview'),
  });

  useEffect(() => {
    const unsubs = [
      subscribe<{ projectId: string }>('preview:native_starting', (data) => {
        if (data.projectId !== projectId) return;
        queryClient.setQueryData<NativePreviewState>(
          NATIVE_PREVIEW_KEY(projectId),
          {
            projectId,
            status: 'building',
          },
        );
      }),
      subscribe<{ projectId: string; expoUrl: string }>(
        'preview:native_ready',
        (data) => {
          if (data.projectId !== projectId) return;
          queryClient.setQueryData<NativePreviewState>(
            NATIVE_PREVIEW_KEY(projectId),
            {
              projectId,
              status: 'ready',
              expoUrl: data.expoUrl,
            },
          );
          toast.success('Phone preview ready — scan the QR code');
        },
      ),
      subscribe<{ projectId: string; error: string }>(
        'preview:native_error',
        (data) => {
          if (data.projectId !== projectId) return;
          queryClient.setQueryData<NativePreviewState>(
            NATIVE_PREVIEW_KEY(projectId),
            {
              projectId,
              status: 'error',
              error: data.error,
            },
          );
          toast.error('Phone preview failed to start');
        },
      ),
      subscribe<{ projectId: string }>('preview:native_stopped', (data) => {
        if (data.projectId !== projectId) return;
        queryClient.setQueryData<NativePreviewState>(
          NATIVE_PREVIEW_KEY(projectId),
          {
            projectId,
            status: 'idle',
          },
        );
      }),
    ];
    return () => {
      for (const u of unsubs) u();
    };
  }, [subscribe, projectId, queryClient]);

  return {
    state,
    status: state?.status ?? 'idle',
    expoUrl: state?.expoUrl,
    error: state?.error,
    isBuilding: state?.status === 'building' || start.isPending,
    start: start.mutate,
    stop: stop.mutate,
    isStopPending: stop.isPending,
  };
}
