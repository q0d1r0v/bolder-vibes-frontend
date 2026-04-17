export type ProjectStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  templateId: string | null;
  settings: { industry?: string } | null;
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

