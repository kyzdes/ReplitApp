import React, { useState, useRef, useEffect } from 'react';
import { useAIStore } from '../stores/useAIStore';
import { useEditorStore } from '../stores/useEditorStore';
import { wsClient } from '../lib/websocket';
import { Send, Sparkles, Code } from 'lucide-react';
import type { AIProviderName } from '@ai-dev-platform/shared';

const PROVIDERS: { value: AIProviderName; label: string }[] = [
  { value: 'anthropic', label: 'Claude 3.5 Sonnet' },
  { value: 'openai', label: 'GPT-4' },
  { value: 'google', label: 'Gemini Pro' },
];

export function AIChat() {
  const { provider, messages, isGenerating, generatedCode, setProvider, addMessage, setGenerating, setGeneratedCode, appendToGeneratedCode } = useAIStore();
  const { updateCode, language } = useEditorStore();
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, generatedCode]);

  useEffect(() => {
    // Listen for streaming responses
    const handleStream = (event: any) => {
      const { chunk } = event.payload;
      if (chunk.delta) {
        appendToGeneratedCode(chunk.delta);
      }
      if (chunk.finished) {
        setGenerating(false);
        addMessage({
          role: 'assistant',
          content: generatedCode,
          timestamp: Date.now(),
        });
      }
    };

    wsClient.on('code:stream', handleStream);
    return () => wsClient.off('code:stream', handleStream);
  }, [generatedCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userMessage = {
      role: 'user' as const,
      content: prompt,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setPrompt('');
    setGenerating(true);
    setGeneratedCode('');

    try {
      wsClient.generateCode({
        prompt,
        provider,
        context: { language },
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      setGenerating(false);
      addMessage({
        role: 'assistant',
        content: `Error: ${error.message}`,
        timestamp: Date.now(),
      });
    }
  };

  const applyGeneratedCode = () => {
    if (generatedCode) {
      updateCode(generatedCode);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
          </div>
        </div>

        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as AIProviderName)}
          className="w-full px-3 py-1.5 text-sm bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {PROVIDERS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-8">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Describe what you want to build</p>
            <p className="text-xs mt-1">AI will generate code in real-time</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              <pre className="whitespace-pre-wrap text-sm font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}

        {isGenerating && generatedCode && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-4 py-2 rounded-lg bg-slate-800 text-slate-200">
              <pre className="whitespace-pre-wrap text-sm font-mono">{generatedCode}</pre>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={applyGeneratedCode}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                >
                  <Code className="w-3 h-3" />
                  Apply to Editor
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 px-4 py-2 bg-slate-700 text-white placeholder-slate-400 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
