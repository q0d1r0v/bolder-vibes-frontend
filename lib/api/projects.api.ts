import api from './axios';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  Template,
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

export async function getTemplates(): Promise<Template[]> {
  const res = await api.get<Template[]>('/projects/templates');
  return res.data;
}
