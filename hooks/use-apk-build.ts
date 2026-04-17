'use client';

import { useEffect, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSocket } from './use-socket';
import {
  startApkBuild,
  getApkStatus,
  downloadApk,
  type AndroidBuildType,
  type ApkBuildMode,
  type ApkBuildPlatform,
  type ApkBuildState,
  type StartApkBuildOptions,
} from '@/lib/api/apk-build.api';

const APK_STATUS_KEY = (projectId: string) => ['apk-status', projectId];
/** Cap the live log buffer so a noisy gradle run doesn't blow up memory. */
const MAX_LOG_LINES = 500;

export function useApkBuild(projectId: string) {
  const { subscribe } = useSocket();
  const queryClient = useQueryClient();
  const [logs, setLogs] = useState<string[]>([]);

  const { data: status } = useQuery({
    queryKey: APK_STATUS_KEY(projectId),
    queryFn: () => getApkStatus(projectId),
    enabled: !!projectId,
  });

  const build = useMutation({
    mutationFn: (opts: StartApkBuildOptions = {}) =>
      startApkBuild(projectId, opts),
    onMutate: () => {
      setLogs([]);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ApkBuildState>(APK_STATUS_KEY(projectId), data);
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Failed to start APK build';
      toast.error(message);
    },
  });

  const download = useCallback(async () => {
    try {
      // Pass the server-provided filename through so the browser saves
      // with the correct extension (.apk / .aab / .tar.gz). Falling
      // back to whatever Content-Disposition the backend sends.
      await downloadApk(projectId, status?.filename);
    } catch {
      toast.error('Failed to download build');
    }
  }, [projectId, status?.filename]);

  useEffect(() => {
    const unsubs = [
      subscribe<{ projectId: string }>('apk:build_started', (data) => {
        if (data.projectId !== projectId) return;
        setLogs([]);
        queryClient.setQueryData<ApkBuildState>(APK_STATUS_KEY(projectId), {
          projectId,
          status: 'building',
        });
      }),
      subscribe<{ projectId: string; line: string }>(
        'apk:build_progress',
        (data) => {
          if (data.projectId !== projectId) return;
          setLogs((prev) => {
            const next = [...prev, data.line];
            return next.length > MAX_LOG_LINES
              ? next.slice(next.length - MAX_LOG_LINES)
              : next;
          });
        },
      ),
      subscribe<{
        projectId: string;
        downloadUrl: string;
        sizeBytes: number;
        builtAt: string;
        mode?: ApkBuildMode;
        platform?: ApkBuildPlatform;
        buildType?: AndroidBuildType | 'simulator' | 'archive';
        filename?: string;
      }>('apk:build_ready', (data) => {
        if (data.projectId !== projectId) return;
        queryClient.setQueryData<ApkBuildState>(APK_STATUS_KEY(projectId), {
          projectId,
          status: 'ready',
          downloadUrl: data.downloadUrl,
          sizeBytes: data.sizeBytes,
          builtAt: data.builtAt,
          mode: data.mode,
          platform: data.platform,
          buildType: data.buildType,
          filename: data.filename,
        });
        const label =
          data.platform === 'ios'
            ? 'iOS simulator build complete'
            : data.buildType === 'aab'
              ? 'AAB build complete'
              : 'APK build complete';
        toast.success(label);
      }),
      subscribe<{
        projectId: string;
        error: string;
        mode?: ApkBuildMode;
        easBuildUrl?: string;
      }>('apk:build_error', (data) => {
        if (data.projectId !== projectId) return;
        queryClient.setQueryData<ApkBuildState>(APK_STATUS_KEY(projectId), {
          projectId,
          status: 'error',
          error: data.error,
          mode: data.mode,
          easBuildUrl: data.easBuildUrl,
        });
        toast.error('APK build failed');
      }),
    ];
    return () => {
      for (const u of unsubs) u();
    };
  }, [subscribe, projectId, queryClient]);

  return {
    status: status?.status ?? 'idle',
    state: status,
    logs,
    build: build.mutate,
    isBuilding:
      status?.status === 'building' || build.isPending,
    download,
  };
}
