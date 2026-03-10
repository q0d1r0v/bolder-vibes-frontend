import api from './axios';
import type {
  ProjectFile,
  FileVersion,
  CreateFileRequest,
  UpdateFileRequest,
} from '@/types';

export async function getFiles(projectId: string): Promise<ProjectFile[]> {
  const res = await api.get<ProjectFile[]>(`/projects/${projectId}/files`);
  return res.data;
}

export async function getFile(projectId: string, fileId: string): Promise<ProjectFile> {
  const res = await api.get<ProjectFile>(`/projects/${projectId}/files/${fileId}`);
  return res.data;
}

export async function createFile(projectId: string, data: CreateFileRequest): Promise<ProjectFile> {
  const res = await api.post<ProjectFile>(`/projects/${projectId}/files`, data);
  return res.data;
}

export async function updateFile(
  projectId: string,
  fileId: string,
  data: UpdateFileRequest
): Promise<ProjectFile> {
  const res = await api.patch<ProjectFile>(`/projects/${projectId}/files/${fileId}`, data);
  return res.data;
}

export async function deleteFile(projectId: string, fileId: string): Promise<void> {
  await api.delete(`/projects/${projectId}/files/${fileId}`);
}

export async function getFileVersions(
  projectId: string,
  fileId: string
): Promise<FileVersion[]> {
  const res = await api.get<FileVersion[]>(`/projects/${projectId}/files/${fileId}/versions`);
  return res.data;
}

export async function restoreFileVersion(
  projectId: string,
  fileId: string,
  versionId: string
): Promise<ProjectFile> {
  const res = await api.post<ProjectFile>(
    `/projects/${projectId}/files/${fileId}/restore/${versionId}`
  );
  return res.data;
}
