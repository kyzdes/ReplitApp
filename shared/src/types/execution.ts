export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'timeout';

export type ExecutionLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown';

export interface ExecutionRequest {
  projectId: string;
  code: string;
  language: ExecutionLanguage;
  files?: Array<{ name: string; content: string }>;
  entryPoint?: string;
  timeout?: number; // milliseconds
  resourceLimits?: {
    cpu?: number; // CPU shares
    memory?: number; // MB
  };
}

export interface ExecutionResult {
  id: string;
  status: ExecutionStatus;
  output?: string;
  error?: string;
  exitCode?: number;
  duration?: number; // milliseconds
  startedAt?: number;
  completedAt?: number;
}

export interface ExecutionOutput {
  type: 'stdout' | 'stderr' | 'error' | 'info';
  content: string;
  timestamp: number;
}
