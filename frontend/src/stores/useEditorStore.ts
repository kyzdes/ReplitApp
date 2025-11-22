import { create } from 'zustand';
import type { ProjectFile } from '@ai-dev-platform/shared';

interface EditorState {
  files: ProjectFile[];
  activeFileId: string | null;
  code: string;
  language: string;

  setFiles: (files: ProjectFile[]) => void;
  setActiveFile: (fileId: string) => void;
  updateCode: (code: string) => void;
  updateFile: (fileId: string, content: string) => void;
  addFile: (file: ProjectFile) => void;
  removeFile: (fileId: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  files: [],
  activeFileId: null,
  code: '',
  language: 'typescript',

  setFiles: (files) => {
    set({ files });
    if (files.length > 0 && !get().activeFileId) {
      const firstFile = files.find(f => f.type === 'file');
      if (firstFile) {
        set({
          activeFileId: firstFile.id,
          code: firstFile.content || '',
          language: firstFile.language || 'typescript',
        });
      }
    }
  },

  setActiveFile: (fileId) => {
    const file = get().files.find(f => f.id === fileId);
    if (file && file.type === 'file') {
      set({
        activeFileId: fileId,
        code: file.content || '',
        language: file.language || 'typescript',
      });
    }
  },

  updateCode: (code) => {
    set({ code });
    const { activeFileId, files } = get();
    if (activeFileId) {
      set({
        files: files.map(f =>
          f.id === activeFileId ? { ...f, content: code } : f
        ),
      });
    }
  },

  updateFile: (fileId, content) => {
    set({
      files: get().files.map(f =>
        f.id === fileId ? { ...f, content } : f
      ),
    });
  },

  addFile: (file) => {
    set({ files: [...get().files, file] });
  },

  removeFile: (fileId) => {
    set({ files: get().files.filter(f => f.id !== fileId) });
    if (get().activeFileId === fileId) {
      set({ activeFileId: null, code: '' });
    }
  },
}));
