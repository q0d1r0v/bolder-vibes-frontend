export type AgentTaskStatus =
  | 'PENDING'
  | 'PLANNING'
  | 'DEVELOPING'
  | 'REFACTORING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type AgentStepStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export type AgentType = 'PLANNER' | 'DEVELOPER' | 'REFACTOR';

export interface AgentTask {
  id: string;
  status: AgentTaskStatus;
  prompt: string;
  plan: Record<string, unknown> | null;
  result: {
    summary: string;
    filesChanged: string[];
    qualityReport?: string;
  } | null;
  errorMessage: string | null;
  projectId: string;
  conversationId: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface AgentStep {
  id: string;
  agentType: AgentType;
  stepOrder: number;
  status: AgentStepStatus;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  tokenUsage: Record<string, unknown> | null;
  errorMessage: string | null;
  durationMs: number | null;
  taskId: string;
}
