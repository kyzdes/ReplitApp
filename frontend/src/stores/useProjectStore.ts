import { create } from 'zustand';
import type { Project } from '@ai-dev-platform/shared';

interface ProjectState {
  currentProject: Project | null;
  projects: Project[];

  setCurrentProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  removeProject: (projectId: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  projects: [],

  setCurrentProject: (project) => set({ currentProject: project }),

  setProjects: (projects) => set({ projects }),

  addProject: (project) =>
    set({ projects: [...get().projects, project] }),

  updateProject: (projectId, updates) =>
    set({
      projects: get().projects.map(p =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
      currentProject:
        get().currentProject?.id === projectId
          ? { ...get().currentProject!, ...updates }
          : get().currentProject,
    }),

  removeProject: (projectId) =>
    set({
      projects: get().projects.filter(p => p.id !== projectId),
      currentProject:
        get().currentProject?.id === projectId ? null : get().currentProject,
    }),
}));
