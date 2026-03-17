export type PreviewStatus = 'idle' | 'building' | 'ready' | 'error';

export interface SandboxExecuteRequest {
  command: string;
  timeoutMs?: number;
  maxMemoryMb?: number;
  networkEnabled?: boolean;
}

export interface SandboxExecuteResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export interface PreviewStartResponse {
  projectId: string;
  status: PreviewStatus;
  startedAt: string;
}

export interface PreviewStatusResponse {
  projectId: string;
  status: PreviewStatus;
  url?: string;
  error?: string;
}
