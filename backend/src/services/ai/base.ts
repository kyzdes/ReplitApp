import { AIGenerateRequest, AIGenerateResponse, AIStreamChunk } from '@ai-dev-platform/shared';

export interface AIService {
  generate(request: AIGenerateRequest): Promise<AIGenerateResponse>;
  stream(request: AIGenerateRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void>;
  chat(messages: Array<{ role: string; content: string }>, options?: any): Promise<string>;
}

export abstract class BaseAIService implements AIService {
  protected apiKey?: string;
  protected baseUrl?: string;
  protected defaultModel: string;

  constructor(apiKey?: string, baseUrl?: string, defaultModel?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.defaultModel = defaultModel || 'default';
  }

  abstract generate(request: AIGenerateRequest): Promise<AIGenerateResponse>;
  abstract stream(request: AIGenerateRequest, onChunk: (chunk: AIStreamChunk) => void): Promise<void>;
  abstract chat(messages: Array<{ role: string; content: string }>, options?: any): Promise<string>;

  protected buildPrompt(request: AIGenerateRequest): string {
    let prompt = request.prompt;

    if (request.context) {
      const { language, framework, existingCode, files } = request.context;

      if (language) {
        prompt = `Language: ${language}\n\n${prompt}`;
      }

      if (framework) {
        prompt = `Framework: ${framework}\n\n${prompt}`;
      }

      if (existingCode) {
        prompt = `Existing code:\n\`\`\`\n${existingCode}\n\`\`\`\n\n${prompt}`;
      }

      if (files && files.length > 0) {
        const filesContext = files
          .map(f => `File: ${f.name}\n\`\`\`\n${f.content}\n\`\`\``)
          .join('\n\n');
        prompt = `${filesContext}\n\n${prompt}`;
      }
    }

    return prompt;
  }

  protected detectLanguage(code: string): string {
    // Simple language detection based on code patterns
    if (code.includes('import React') || code.includes('jsx')) return 'typescript';
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('function') || code.includes('const ')) return 'javascript';
    if (code.includes('<template>')) return 'vue';
    if (code.includes('<!DOCTYPE html>')) return 'html';
    return 'plaintext';
  }
}
