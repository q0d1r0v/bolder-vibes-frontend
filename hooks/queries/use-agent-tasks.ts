'use client';

import { useQuery } from '@tanstack/react-query';
import * as agentTasksApi from '@/lib/api/agent-tasks.api';
import { QUERY_KEYS } from '@/lib/constants';
import type { PaginationParams } from '@/types';

export function useAgentTasks(projectId: string, params?: PaginationParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.AGENT_TASKS(projectId), params],
    queryFn: () => agentTasksApi.getAgentTasks(projectId, params),
    enabled: !!projectId,
  });
}

export function useAgentTask(projectId: string, taskId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.AGENT_TASK(projectId, taskId),
    queryFn: () => agentTasksApi.getAgentTask(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
}
