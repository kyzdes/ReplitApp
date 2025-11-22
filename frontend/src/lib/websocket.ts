import { io, Socket } from 'socket.io-client';
import type {
  WebSocketEvent,
  CodeGenerateEvent,
  AIStreamChunk,
  ExecutionOutput,
} from '@ai-dev-platform/shared';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

class WebSocketClient {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.emit('connected', {});
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected', {});
    });

    // Forward all events to listeners
    this.socket.onAny((eventName: string, event: WebSocketEvent) => {
      this.emit(eventName, event);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Generate code with streaming
  generateCode(payload: CodeGenerateEvent): void {
    if (!this.socket) throw new Error('WebSocket not connected');

    const event: WebSocketEvent<CodeGenerateEvent> = {
      type: 'code:generate',
      payload,
      timestamp: Date.now(),
    };

    this.socket.emit('code:generate', event);
  }

  // Execute code
  executeCode(request: any): void {
    if (!this.socket) throw new Error('WebSocket not connected');

    const event: WebSocketEvent = {
      type: 'execution:start',
      payload: request,
      timestamp: Date.now(),
    };

    this.socket.emit('execution:start', event);
  }

  // Collaboration
  joinProject(projectId: string, userId: string): void {
    if (!this.socket) throw new Error('WebSocket not connected');

    const event: WebSocketEvent = {
      type: 'collaboration:join',
      payload: { projectId, userId },
      timestamp: Date.now(),
    };

    this.socket.emit('collaboration:join', event);
  }

  leaveProject(projectId: string, userId: string): void {
    if (!this.socket) throw new Error('WebSocket not connected');

    const event: WebSocketEvent = {
      type: 'collaboration:leave',
      payload: { projectId, userId },
      timestamp: Date.now(),
    };

    this.socket.emit('collaboration:leave', event);
  }

  // Event listeners
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
}

export const wsClient = new WebSocketClient();
export default wsClient;
