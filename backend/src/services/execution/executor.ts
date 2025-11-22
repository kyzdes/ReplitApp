import { ExecutionRequest, ExecutionResult, ExecutionOutput } from '@ai-dev-platform/shared';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config';

export class CodeExecutor extends EventEmitter {
  private executions = new Map<string, ExecutionResult>();

  async execute(request: ExecutionRequest): Promise<string> {
    const id = uuidv4();
    const result: ExecutionResult = {
      id,
      status: 'pending',
      startedAt: Date.now(),
    };

    this.executions.set(id, result);

    // Execute asynchronously
    this.executeCode(id, request);

    return id;
  }

  private async executeCode(id: string, request: ExecutionRequest): Promise<void> {
    const result = this.executions.get(id);
    if (!result) return;

    result.status = 'running';
    this.emit('status', { id, status: 'running' });

    try {
      // Create timeout promise
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Execution timeout')),
          request.timeout || config.execution.maxTimeMs
        );
      });

      // Execute based on language
      const executionPromise = this.executeByLanguage(id, request);

      // Race between execution and timeout
      const output = await Promise.race([executionPromise, timeout]);

      result.status = 'completed';
      result.output = output;
      result.exitCode = 0;
      result.completedAt = Date.now();
      result.duration = result.completedAt - (result.startedAt || 0);

      this.emit('complete', result);
    } catch (error: any) {
      result.status = 'failed';
      result.error = error.message;
      result.exitCode = 1;
      result.completedAt = Date.now();
      result.duration = result.completedAt - (result.startedAt || 0);

      this.emit('error', { id, error: error.message });
    }
  }

  private async executeByLanguage(id: string, request: ExecutionRequest): Promise<string> {
    switch (request.language) {
      case 'javascript':
      case 'typescript':
        return this.executeJavaScript(id, request);

      case 'python':
        return this.executePython(id, request);

      case 'html':
        return this.executeHTML(id, request);

      default:
        throw new Error(`Unsupported language: ${request.language}`);
    }
  }

  private async executeJavaScript(id: string, request: ExecutionRequest): Promise<string> {
    // For browser-based execution, we'll return the code for frontend to execute
    // In a production environment, this would use vm2 or isolated containers
    this.emitOutput(id, {
      type: 'info',
      content: 'JavaScript execution prepared for browser sandbox',
      timestamp: Date.now(),
    });

    return request.code;
  }

  private async executePython(id: string, request: ExecutionRequest): Promise<string> {
    // In production, this would use Docker containers or Pyodide
    this.emitOutput(id, {
      type: 'info',
      content: 'Python execution requires Docker container (not implemented in MVP)',
      timestamp: Date.now(),
    });

    throw new Error('Python execution requires Docker setup');
  }

  private async executeHTML(id: string, request: ExecutionRequest): Promise<string> {
    // HTML can be safely rendered in iframe
    this.emitOutput(id, {
      type: 'info',
      content: 'HTML prepared for preview',
      timestamp: Date.now(),
    });

    return request.code;
  }

  private emitOutput(id: string, output: ExecutionOutput): void {
    this.emit('output', { id, output });
  }

  getResult(id: string): ExecutionResult | undefined {
    return this.executions.get(id);
  }

  cancel(id: string): boolean {
    const result = this.executions.get(id);
    if (!result || result.status === 'completed' || result.status === 'failed') {
      return false;
    }

    result.status = 'failed';
    result.error = 'Execution cancelled';
    result.completedAt = Date.now();
    result.duration = result.completedAt - (result.startedAt || 0);

    this.emit('cancelled', { id });
    return true;
  }
}
