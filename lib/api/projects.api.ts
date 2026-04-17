import api from './axios';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export async function getProjects(params?: PaginationParams): Promise<PaginatedResponse<Project>> {
  const res = await api.get<PaginatedResponse<Project>>('/projects', { params });
  return res.data;
}

export async function getProject(id: string): Promise<Project> {
  const res = await api.get<Project>(`/projects/${id}`);
  return res.data;
}

export async function createProject(data: CreateProjectRequest): Promise<Project> {
  const res = await api.post<Project>('/projects', data);
  return res.data;
}

export async function updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
  const res = await api.patch<Project>(`/projects/${id}`, data);
  return res.data;
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}

/**
 * Fetch the project source code as a ZIP blob and trigger a browser
 * download. Returns the suggested filename from the server.
 */
export async function downloadProjectSource(
  id: string,
): Promise<{ filename: string }> {
  const res = await api.get<Blob>(`/projects/${id}/download`, {
    responseType: 'blob',
  });

  // Prefer the server-supplied filename from Content-Disposition,
  // fall back to a sensible default.
  const disposition =
    (res.headers['content-disposition'] as string | undefined) ?? '';
  const match = /filename="?([^"]+)"?/i.exec(disposition);
  const filename = match?.[1] ?? `project-${id.slice(0, 8)}-source.zip`;

  const url = window.URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { filename };
}

