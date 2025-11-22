import axios from 'axios';
import type {
  ApiResponse,
  AIGenerateRequest,
  AIGenerateResponse,
  Project,
  CreateProjectRequest,
  ExecutionRequest,
  ExecutionResult,
  AIProviderName,
} from '@ai-dev-platform/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Endpoints
export const aiApi = {
  generate: async (request: AIGenerateRequest): Promise<AIGenerateResponse> => {
    const { data } = await api.post<ApiResponse<AIGenerateResponse>>('/ai/generate', request);
    return data.data!;
  },

  chat: async (
    provider: AIProviderName,
    messages: Array<{ role: string; content: string }>,
    options?: any
  ): Promise<string> => {
    const { data } = await api.post<ApiResponse<{ response: string }>>('/ai/chat', {
      provider,
      messages,
      options,
    });
    return data.data!.response;
  },

  getProviders: async (): Promise<AIProviderName[]> => {
    const { data } = await api.get<ApiResponse<{ providers: AIProviderName[] }>>('/ai/providers');
    return data.data!.providers;
  },
};

// Project Endpoints
export const projectApi = {
  getAll: async (): Promise<Project[]> => {
    const { data } = await api.get<ApiResponse<{ items: Project[] }>>('/projects');
    return data.data!.items;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return data.data!;
  },

  create: async (request: CreateProjectRequest): Promise<Project> => {
    const { data } = await api.post<ApiResponse<Project>>('/projects', request);
    return data.data!;
  },

  update: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, updates);
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Execution Endpoints
export const executionApi = {
  execute: async (request: ExecutionRequest): Promise<string> => {
    const { data } = await api.post<ApiResponse<{ executionId: string }>>('/execute', request);
    return data.data!.executionId;
  },

  getResult: async (id: string): Promise<ExecutionResult> => {
    const { data } = await api.get<ApiResponse<ExecutionResult>>(`/execute/${id}`);
    return data.data!;
  },

  cancel: async (id: string): Promise<void> => {
    await api.delete(`/execute/${id}`);
  },
};

export default api;
