import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { CodeEditor } from './components/Editor';
import { Preview } from './components/Preview';
import { AIChat } from './components/AIChat';
import { Console } from './components/Console';
import { FileTree } from './components/FileTree';
import { useProjectStore } from './stores/useProjectStore';
import { useEditorStore } from './stores/useEditorStore';
import { projectApi, aiApi } from './lib/api';
import { wsClient } from './lib/websocket';
import { Code2, Sparkles, Settings, Plus } from 'lucide-react';
import type { ProjectTemplate } from '@ai-dev-platform/shared';

function App() {
  const { currentProject, setCurrentProject } = useProjectStore();
  const { setFiles } = useEditorStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);

  // Connect WebSocket
  useEffect(() => {
    wsClient.connect();
    return () => wsClient.disconnect();
  }, []);

  // Fetch available AI providers
  useEffect(() => {
    aiApi.getProviders().then(setProviders).catch(console.error);
  }, []);

  // Load project
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
  });

  const createProject = async (template: ProjectTemplate) => {
    try {
      const project = await projectApi.create({
        name: `New ${template} Project`,
        template,
      });

      setCurrentProject(project);
      setFiles(project.files);
      setShowNewProject(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* Header */}
      <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-purple-500" />
            <h1 className="text-lg font-bold">AI Dev Platform</h1>
          </div>

          {currentProject && (
            <div className="ml-4 px-3 py-1 bg-slate-700 rounded text-sm">
              {currentProject.name}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>

          <button className="p-2 hover:bg-slate-700 rounded transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>

            <div className="grid grid-cols-2 gap-4">
              {(['react-ts', 'html-css-js', 'nodejs', 'python-flask'] as ProjectTemplate[]).map(template => (
                <button
                  key={template}
                  onClick={() => createProject(template)}
                  className="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-left transition-colors"
                >
                  <div className="font-semibold mb-1">{template}</div>
                  <div className="text-sm text-slate-400">
                    {template.includes('react') && 'React with TypeScript'}
                    {template === 'html-css-js' && 'Vanilla HTML, CSS, JS'}
                    {template === 'nodejs' && 'Node.js + Express'}
                    {template === 'python-flask' && 'Python Flask API'}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewProject(false)}
              className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!currentProject ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to AI Dev Platform</h2>
              <p className="text-slate-400 mb-6">
                Create a new project or open an existing one to get started
              </p>
              <button
                onClick={() => setShowNewProject(true)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Create Your First Project
              </button>

              {providers.length > 0 && (
                <div className="mt-6 text-sm text-slate-400">
                  Available AI: {providers.join(', ')}
                </div>
              )}
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal">
            {/* File Tree */}
            <Panel defaultSize={15} minSize={10}>
              <FileTree />
            </Panel>

            <PanelResizeHandle className="w-1 bg-slate-700 hover:bg-purple-500 transition-colors" />

            {/* Editor + Preview */}
            <Panel defaultSize={50} minSize={30}>
              <PanelGroup direction="vertical">
                {/* Code Editor */}
                <Panel defaultSize={70} minSize={30}>
                  <CodeEditor />
                </Panel>

                <PanelResizeHandle className="h-1 bg-slate-700 hover:bg-purple-500 transition-colors" />

                {/* Preview + Console */}
                <Panel defaultSize={30} minSize={20}>
                  <PanelGroup direction="horizontal">
                    <Panel defaultSize={60}>
                      <Preview />
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-slate-700" />
                    <Panel defaultSize={40}>
                      <Console />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-1 bg-slate-700 hover:bg-purple-500 transition-colors" />

            {/* AI Chat */}
            <Panel defaultSize={35} minSize={25}>
              <AIChat />
            </Panel>
          </PanelGroup>
        )}
      </div>
    </div>
  );
}

export default App;
