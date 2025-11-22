export type AICapability = 'code' | 'chat' | 'vision' | 'reasoning';

export type AIProviderName = 'openai' | 'anthropic' | 'google' | 'mistral' | 'ollama' | 'custom';

export interface AIProvider {
  name: AIProviderName;
  displayName: string;
  endpoint: string;
  apiKey?: string;
  modelId: string;
  capabilities: AICapability[];
  streamingSupport: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface AIGenerateRequest {
  provider: AIProviderName;
  prompt: string;
  context?: {
    language?: string;
    framework?: string;
    existingCode?: string;
    files?: Array<{ name: string; content: string }>;
  };
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
}

export interface AIGenerateResponse {
  code: string;
  explanation?: string;
  language: string;
  tokensUsed?: number;
  model?: string;
}

export interface AIStreamChunk {
  delta: string;
  finished: boolean;
}
