'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as filesApi from '@/lib/api/files.api';
import { QUERY_KEYS } from '@/lib/constants';
import type { CreateFileRequest, UpdateFileRequest } from '@/types';

export function useFiles(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.FILES(projectId),
    queryFn: () => filesApi.getFiles(projectId),
    enabled: !!projectId,
  });
}

export function useFile(projectId: string, fileId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.FILE(projectId, fileId),
    queryFn: () => filesApi.getFile(projectId, fileId),
    enabled: !!projectId && !!fileId,
  });
}

export function useFileVersions(projectId: string, fileId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.FILE_VERSIONS(projectId, fileId),
    queryFn: () => filesApi.getFileVersions(projectId, fileId),
    enabled: !!projectId && !!fileId,
  });
}

export function useCreateFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFileRequest) => filesApi.createFile(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
    },
    onError: () => {
      toast.error('Failed to create file');
    },
  });
}

export function useUpdateFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, data }: { fileId: string; data: UpdateFileRequest }) =>
      filesApi.updateFile(projectId, fileId, data),
    onSuccess: (_, { fileId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILE(projectId, fileId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILE_VERSIONS(projectId, fileId) });
    },
    onError: () => {
      toast.error('Failed to save file');
    },
  });
}

export function useDeleteFile(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fileId: string) => filesApi.deleteFile(projectId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
      toast.success('File deleted');
    },
    onError: () => {
      toast.error('Failed to delete file');
    },
  });
}

export function useRestoreVersion(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fileId, versionId }: { fileId: string; versionId: string }) =>
      filesApi.restoreFileVersion(projectId, fileId, versionId),
    onSuccess: (_, { fileId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILES(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILE(projectId, fileId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FILE_VERSIONS(projectId, fileId) });
      toast.success('File restored');
    },
    onError: () => {
      toast.error('Failed to restore version');
    },
  });
}
