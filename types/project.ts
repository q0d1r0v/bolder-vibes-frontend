export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  templateId: string | null;
  settings: Record<string, unknown>;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    files: number;
    conversations: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  templateId?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  files: Array<{ path: string; content: string }>;
}
