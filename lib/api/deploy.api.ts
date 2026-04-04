import api from './axios';

export type DeployProvider = 'vercel' | 'railway' | 'download';

export interface DeployRequest {
  provider: DeployProvider;
  token?: string;
  railwayToken?: string;
  projectName?: string;
}

export interface DeployResponseData {
  provider: string;
  projectId?: string;
  serviceId?: string;
  deploymentId?: string;
  url?: string;
  downloadUrl?: string;
}

export async function deployProject(
  projectId: string,
  data: DeployRequest,
): Promise<DeployResponseData> {
  const res = await api.post<DeployResponseData>(
    `/projects/${projectId}/deploy`,
    data,
  );
  return res.data;
}

export async function downloadProject(projectId: string): Promise<Blob> {
  const res = await api.get(`/projects/${projectId}/deploy/download`, {
    responseType: 'blob',
  });
  return res.data;
}
