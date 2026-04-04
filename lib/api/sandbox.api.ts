import api from './axios';
import type {
  SandboxExecuteRequest,
  SandboxExecuteResponse,
  PreviewStartResponse,
  PreviewStatusResponse,
} from '@/types';

export async function executeSandbox(
  projectId: string,
  data: SandboxExecuteRequest
): Promise<SandboxExecuteResponse> {
  const res = await api.post<SandboxExecuteResponse>(
    `/projects/${projectId}/sandbox/execute`,
    data
  );
  return res.data;
}

export async function startPreview(projectId: string): Promise<PreviewStartResponse> {
  const res = await api.post<PreviewStartResponse>(
    `/projects/${projectId}/sandbox/preview/start`
  );
  return res.data;
}

export async function getPreviewStatus(projectId: string): Promise<PreviewStatusResponse> {
  const res = await api.get<PreviewStatusResponse>(
    `/projects/${projectId}/sandbox/preview/status`
  );
  return res.data;
}

export async function stopPreview(projectId: string): Promise<void> {
  await api.post(`/projects/${projectId}/sandbox/preview/stop`);
}

export async function getPreviewToken(
  projectId: string
): Promise<{ token: string }> {
  const res = await api.get<{ token: string }>(
    `/projects/${projectId}/preview/token`
  );
  return res.data;
}
