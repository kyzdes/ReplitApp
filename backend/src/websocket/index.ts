import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { AIServiceFactory } from '../services/ai/factory';
import { executor } from '../routes/execution';
import { WebSocketEvent, CodeGenerateEvent } from '@ai-dev-platform/shared';
import { config } from '../config';

export function setupWebSocket(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.server.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle code generation with streaming
    socket.on('code:generate', async (event: WebSocketEvent<CodeGenerateEvent>) => {
      try {
        const { prompt, provider, context } = event.payload;
        const requestId = `gen-${Date.now()}`;

        const service = AIServiceFactory.getService(provider as any);

        // Stream the response
        await service.stream(
          {
            provider: provider as any,
            prompt,
            context,
            options: { stream: true },
          },
          (chunk) => {
            socket.emit('code:stream', {
              type: 'code:stream',
              payload: { chunk, requestId },
              timestamp: Date.now(),
            });
          }
        );
      } catch (error: any) {
        socket.emit('code:error', {
          type: 'execution:error',
          payload: { error: error.message },
          timestamp: Date.now(),
        });
      }
    });

    // Handle code updates (for collaboration)
    socket.on('code:update', (event: WebSocketEvent) => {
      // Broadcast to other clients in the same room
      socket.broadcast.emit('code:update', event);
    });

    // Handle execution events
    socket.on('execution:start', async (event: WebSocketEvent) => {
      try {
        const executionId = await executor.execute(event.payload);

        socket.emit('execution:started', {
          type: 'execution:start',
          payload: { executionId },
          timestamp: Date.now(),
        });
      } catch (error: any) {
        socket.emit('execution:error', {
          type: 'execution:error',
          payload: { error: error.message },
          timestamp: Date.now(),
        });
      }
    });

    // Forward execution events to connected clients
    const handleExecutionOutput = (data: any) => {
      socket.emit('execution:output', {
        type: 'execution:output',
        payload: data,
        timestamp: Date.now(),
      });
    };

    const handleExecutionComplete = (data: any) => {
      socket.emit('execution:complete', {
        type: 'execution:complete',
        payload: data,
        timestamp: Date.now(),
      });
    };

    const handleExecutionError = (data: any) => {
      socket.emit('execution:error', {
        type: 'execution:error',
        payload: data,
        timestamp: Date.now(),
      });
    };

    executor.on('output', handleExecutionOutput);
    executor.on('complete', handleExecutionComplete);
    executor.on('error', handleExecutionError);

    // Handle collaboration events
    socket.on('collaboration:join', (event: WebSocketEvent) => {
      const { projectId } = event.payload;
      socket.join(`project:${projectId}`);

      socket.to(`project:${projectId}`).emit('collaboration:join', event);
    });

    socket.on('collaboration:leave', (event: WebSocketEvent) => {
      const { projectId } = event.payload;
      socket.leave(`project:${projectId}`);

      socket.to(`project:${projectId}`).emit('collaboration:leave', event);
    });

    socket.on('collaboration:cursor', (event: WebSocketEvent) => {
      const { projectId } = event.payload;
      socket.to(`project:${projectId}`).emit('collaboration:cursor', event);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Clean up listeners
      executor.off('output', handleExecutionOutput);
      executor.off('complete', handleExecutionComplete);
      executor.off('error', handleExecutionError);
    });
  });

  return io;
}
