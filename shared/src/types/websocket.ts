import { AIStreamChunk } from './ai';
import { ExecutionOutput } from './execution';

export type WebSocketEventType =
  | 'connect'
  | 'disconnect'
  | 'code:generate'
  | 'code:stream'
  | 'code:update'
  | 'execution:start'
  | 'execution:output'
  | 'execution:complete'
  | 'execution:error'
  | 'project:update'
  | 'collaboration:join'
  | 'collaboration:leave'
  | 'collaboration:cursor';

export interface WebSocketEvent<T = any> {
  type: WebSocketEventType;
  payload: T;
  timestamp: number;
  userId?: string;
}

export interface CodeGenerateEvent {
  prompt: string;
  provider: string;
  context?: Record<string, any>;
}

export interface CodeStreamEvent {
  chunk: AIStreamChunk;
  requestId: string;
}

export interface CodeUpdateEvent {
  fileId: string;
  content: string;
  userId: string;
}

export interface ExecutionOutputEvent {
  executionId: string;
  output: ExecutionOutput;
}

export interface CollaborationCursor {
  userId: string;
  username: string;
  position: {
    line: number;
    column: number;
  };
  fileId: string;
  color: string;
}
