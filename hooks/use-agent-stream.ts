'use client';

import { useEffect } from 'react';
import { useSocket } from './use-socket';
import { useAgentStore } from '@/stores/agent-store';
import type { AgentTask, AgentStep, AgentType } from '@/types';

export function useAgentStream() {
  const { subscribe } = useSocket();
  const { setTask, addStep, updateStep, appendPartialOutput, completeTask, failTask } =
    useAgentStore();

  useEffect(() => {
    const unsubs = [
      subscribe<{ taskId: string; prompt: string; status: string }>(
        'agent:task_started',
        (data) => {
          setTask({
            id: data.taskId,
            prompt: data.prompt,
            status: 'PENDING',
            plan: null,
            result: null,
            errorMessage: null,
            projectId: '',
            conversationId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null,
          });
        }
      ),

      subscribe<{
        taskId: string;
        stepId: string;
        agentType: AgentType;
        stepOrder: number;
      }>('agent:step_started', (data) => {
        addStep({
          id: data.stepId,
          agentType: data.agentType,
          stepOrder: data.stepOrder,
          status: 'RUNNING',
          input: null,
          output: null,
          tokenUsage: null,
          errorMessage: null,
          durationMs: null,
          taskId: data.taskId,
        });
      }),

      subscribe<{ stepId: string; partialOutput: string }>(
        'agent:step_progress',
        (data) => {
          appendPartialOutput(data.partialOutput);
        }
      ),

      subscribe<{
        stepId: string;
        agentType: AgentType;
        output: Record<string, unknown>;
        durationMs: number;
      }>('agent:step_completed', (data) => {
        updateStep(data.stepId, {
          status: 'COMPLETED',
          output: data.output,
          durationMs: data.durationMs,
        });
      }),

      subscribe<{
        taskId: string;
        status: string;
        result: AgentTask['result'];
      }>('agent:task_completed', (data) => {
        completeTask(data.result);
      }),

      subscribe<{ taskId: string; error: string }>(
        'agent:task_failed',
        (data) => {
          failTask(data.error);
        }
      ),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [subscribe, setTask, addStep, updateStep, appendPartialOutput, completeTask, failTask]);
}
