import api from './axios';
import type { AgentTask, PaginatedResponse, PaginationParams } from '@/types';

export async function getAgentTasks(
  projectId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<AgentTask>> {
  const res = await api.get<PaginatedResponse<AgentTask>>(
    `/projects/${projectId}/tasks`,
    { params }
  );
  return res.data;
}

export async function getAgentTask(
  projectId: string,
  taskId: string
): Promise<AgentTask> {
  const res = await api.get<AgentTask>(
    `/projects/${projectId}/tasks/${taskId}`
  );
  return res.data;
}
