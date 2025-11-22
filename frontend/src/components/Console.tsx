import React, { useState, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';

interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: number;
}

export function Console() {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);

  useEffect(() => {
    // Intercept console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      originalLog(...args);
      addMessage('log', args.join(' '));
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      addMessage('error', args.join(' '));
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      addMessage('warn', args.join(' '));
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const addMessage = (type: ConsoleMessage['type'], content: string) => {
    setMessages(prev => [...prev, { type, content, timestamp: Date.now() }]);
  };

  const clearConsole = () => {
    setMessages([]);
  };

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Console</h3>
        </div>
        <button
          onClick={clearConsole}
          className="p-1 hover:bg-slate-700 rounded transition-colors"
          title="Clear console"
        >
          <Trash2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm">
        {messages.length === 0 ? (
          <div className="text-slate-500 text-center mt-8">
            Console output will appear here
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`${getMessageColor(msg.type)}`}>
              <span className="text-slate-500 mr-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              {msg.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
