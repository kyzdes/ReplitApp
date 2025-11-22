import { Router, Request, Response } from 'express';
import { Project, CreateProjectRequest, ProjectTemplate } from '@ai-dev-platform/shared';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage (in production, use database)
const projects = new Map<string, Project>();

// Project templates
const templates: Record<ProjectTemplate, any> = {
  'react': {
    files: [
      {
        id: uuidv4(),
        name: 'App.tsx',
        path: '/App.tsx',
        type: 'file' as const,
        language: 'typescript',
        content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Hello React!</h1>
    </div>
  );
}

export default App;`,
      },
      {
        id: uuidv4(),
        name: 'index.tsx',
        path: '/index.tsx',
        type: 'file' as const,
        language: 'typescript',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      },
    ],
  },
  'react-ts': {
    files: [
      {
        id: uuidv4(),
        name: 'App.tsx',
        path: '/App.tsx',
        type: 'file' as const,
        language: 'typescript',
        content: `import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello TypeScript + React!</h1>
    </div>
  );
};

export default App;`,
      },
    ],
  },
  'html-css-js': {
    files: [
      {
        id: uuidv4(),
        name: 'index.html',
        path: '/index.html',
        type: 'file' as const,
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Hello World!</h1>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        id: uuidv4(),
        name: 'style.css',
        path: '/style.css',
        type: 'file' as const,
        language: 'css',
        content: `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #333;
}`,
      },
      {
        id: uuidv4(),
        name: 'script.js',
        path: '/script.js',
        type: 'file' as const,
        language: 'javascript',
        content: `console.log('Hello from JavaScript!');`,
      },
    ],
  },
  'blank': { files: [] },
  'vue': { files: [] },
  'vue-ts': { files: [] },
  'nextjs': { files: [] },
  'nodejs': { files: [] },
  'python-flask': { files: [] },
  'python-fastapi': { files: [] },
};

// Get all projects
router.get('/', (req: Request, res: Response) => {
  const projectList = Array.from(projects.values());

  res.json({
    success: true,
    data: {
      items: projectList,
      total: projectList.length,
    },
  });
});

// Get single project
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.get(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: { message: 'Project not found' },
    });
  }

  res.json({
    success: true,
    data: project,
  });
});

// Create project
router.post('/', (req: Request, res: Response) => {
  try {
    const request: CreateProjectRequest = req.body;

    if (!request.name || !request.template) {
      return res.status(400).json({
        success: false,
        error: { message: 'Name and template are required' },
      });
    }

    const template = templates[request.template];
    if (!template) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid template' },
      });
    }

    const now = Date.now();
    const project: Project = {
      id: uuidv4(),
      name: request.name,
      description: request.description,
      template: request.template,
      files: template.files || [],
      createdAt: now,
      updatedAt: now,
    };

    projects.set(project.id, project);

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Update project
router.put('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = projects.get(id);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: { message: 'Project not found' },
    });
  }

  const updates = req.body;
  const updatedProject = {
    ...project,
    ...updates,
    id, // Preserve ID
    updatedAt: Date.now(),
  };

  projects.set(id, updatedProject);

  res.json({
    success: true,
    data: updatedProject,
  });
});

// Delete project
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  if (!projects.has(id)) {
    return res.status(404).json({
      success: false,
      error: { message: 'Project not found' },
    });
  }

  projects.delete(id);

  res.json({
    success: true,
    data: { deleted: true },
  });
});

export default router;
