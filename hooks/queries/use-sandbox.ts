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
    onError: () => {
      toast.error('Failed to start preview');
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

export function useExecuteSandbox(projectId: string) {
  return useMutation({
    mutationFn: (data: SandboxExecuteRequest) =>
      sandboxApi.executeSandbox(projectId, data),
    onError: () => {
      toast.error('Command execution failed');
    },
  });
}
