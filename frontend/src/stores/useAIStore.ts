import { create } from 'zustand';
import type { AIProviderName, AIMessage } from '@ai-dev-platform/shared';

interface AIState {
  provider: AIProviderName;
  messages: AIMessage[];
  isGenerating: boolean;
  generatedCode: string;

  setProvider: (provider: AIProviderName) => void;
  addMessage: (message: AIMessage) => void;
  setGenerating: (isGenerating: boolean) => void;
  setGeneratedCode: (code: string) => void;
  appendToGeneratedCode: (chunk: string) => void;
  clearMessages: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  provider: 'anthropic',
  messages: [],
  isGenerating: false,
  generatedCode: '',

  setProvider: (provider) => set({ provider }),

  addMessage: (message) =>
    set({ messages: [...get().messages, message] }),

  setGenerating: (isGenerating) => set({ isGenerating }),

  setGeneratedCode: (code) => set({ generatedCode: code }),

  appendToGeneratedCode: (chunk) =>
    set({ generatedCode: get().generatedCode + chunk }),

  clearMessages: () => set({ messages: [], generatedCode: '' }),
}));
