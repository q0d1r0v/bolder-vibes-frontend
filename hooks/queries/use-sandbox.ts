'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as sandboxApi from '@/lib/api/sandbox.api';
import { QUERY_KEYS } from '@/lib/constants';
import type { SandboxExecuteRequest } from '@/types';

export function usePreviewStatus(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId),
    queryFn: () => sandboxApi.getPreviewStatus(projectId),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'building' ? 3000 : false;
    },
  });
}

export function useStartPreview(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sandboxApi.startPreview(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId) });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      const status = axiosError?.response?.status;
      if (status === 401) {
        toast.error('Session expired. Please log in again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        toast.error('You do not have permission to access this project.');
      } else if (status === 404) {
        toast.error('Project not found.');
      } else {
        toast.error('Failed to start preview. Please try again.');
      }
    },
  });
}

export function useStopPreview(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sandboxApi.stopPreview(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId) });
    },
    onError: () => {
      toast.error('Failed to stop preview');
    },
  });
}

/**
 * Restart = stop → tiny delay for the container to tear down → start.
 * Surfaces a single mutation to the UI so the user only clicks once
 * when the in-memory Metro cache or a stale preview instance is making
 * the iframe show old output.
 */
export function useRestartPreview(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await sandboxApi.stopPreview(projectId);
      } catch {
        /* already stopped — fall through to start */
      }
      // Small delay so the Docker daemon finishes releasing the
      // container name + host port before the new one spawns.
      await new Promise((r) => setTimeout(r, 500));
      return sandboxApi.startPreview(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SANDBOX_STATUS(projectId),
      });
    },
    onError: () => {
      toast.error('Failed to restart preview');
    },
  });
}

export function useExecuteSandbox(projectId: string) {
  return useMutation({
    mutationFn: (data: SandboxExecuteRequest) =>
      sandboxApi.executeSandbox(projectId, data),
    onError: () => {
      toast.error('Command execution failed');
    },
  });
}
