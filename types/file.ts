export interface ProjectFile {
  id: string;
  path: string;
  content: string;
  mimeType: string | null;
  size: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileVersion {
  id: string;
  version: number;
  content: string;
  diff: string | null;
  message: string | null;
  fileId: string;
  agentStepId: string | null;
  createdAt: string;
}

export interface CreateFileRequest {
  path: string;
  content: string;
  mimeType?: string;
}

export interface UpdateFileRequest {
  content: string;
  message?: string;
}
