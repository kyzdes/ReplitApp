import React from 'react';
import { File, Folder, FolderOpen } from 'lucide-react';
import { useEditorStore } from '../stores/useEditorStore';
import type { ProjectFile } from '@ai-dev-platform/shared';

export function FileTree() {
  const { files, activeFileId, setActiveFile } = useEditorStore();

  const renderFile = (file: ProjectFile) => {
    const isActive = file.id === activeFileId;

    return (
      <div
        key={file.id}
        onClick={() => file.type === 'file' && setActiveFile(file.id)}
        className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-slate-700 transition-colors ${
          isActive ? 'bg-slate-700 text-purple-400' : 'text-slate-300'
        }`}
      >
        {file.type === 'directory' ? (
          <Folder className="w-4 h-4 text-slate-400" />
        ) : (
          <File className="w-4 h-4 text-slate-400" />
        )}
        <span className="text-sm">{file.name}</span>
      </div>
    );
  };

  return (
    <div className="h-full bg-slate-900 border-r border-slate-700">
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-white">Files</h3>
      </div>
      <div className="overflow-y-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            No files yet
          </div>
        ) : (
          files.map(renderFile)
        )}
      </div>
    </div>
  );
}
