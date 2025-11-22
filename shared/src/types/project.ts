export type ProjectTemplate =
  | 'react'
  | 'react-ts'
  | 'vue'
  | 'vue-ts'
  | 'nextjs'
  | 'nodejs'
  | 'python-flask'
  | 'python-fastapi'
  | 'html-css-js'
  | 'blank';

export type FileType = 'file' | 'directory';

export interface ProjectFile {
  id: string;
  name: string;
  path: string;
  type: FileType;
  content?: string;
  language?: string;
  children?: ProjectFile[];
  size?: number;
  modified?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  template: ProjectTemplate;
  files: ProjectFile[];
  createdAt: number;
  updatedAt: number;
  userId?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  template: ProjectTemplate;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  files?: ProjectFile[];
  tags?: string[];
}
