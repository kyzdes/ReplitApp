# 🚀 Quick Start Guide

Get your AI Dev Platform running in minutes!

## Prerequisites

- Node.js 18+ and npm 9+
- At least one AI API key (OpenAI, Anthropic, or Google)
- Docker (optional, for containerized deployment)

## 🎯 5-Minute Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all workspace dependencies
cd frontend && npm install
cd ../backend && npm install
cd ../shared && npm install
cd ..
```

### 2. Configure API Keys

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your API key(s):

```env
# At least one is required
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

### 3. Create Frontend Environment

```bash
cd ../frontend
cp .env.example .env
```

The default values should work for local development.

### 4. Build Shared Package

```bash
cd ../shared
npm run build
cd ..
```

### 5. Start Development Servers

From the root directory:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🎨 Using the Platform

### Create Your First Project

1. Open http://localhost:5173 in your browser
2. Click "Create Your First Project"
3. Select a template (React, HTML/CSS/JS, etc.)
4. Start coding!

### Generate Code with AI

1. In the AI Chat panel, select your AI provider (Claude, GPT-4, etc.)
2. Type a prompt like: "Create a todo list component with React hooks"
3. Watch as AI generates code in real-time
4. Click "Apply to Editor" to use the generated code

### Preview Your Work

The preview panel automatically updates as you type, showing your app in real-time.

### Console Output

Check the console panel for logs, errors, and debugging information.

## 🐳 Docker Deployment (Alternative)

If you prefer Docker:

```bash
# Create .env file with API keys
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Troubleshooting

### Port Already in Use

If ports 3000 or 5173 are in use:

**Frontend**: Edit `frontend/vite.config.ts`
```ts
server: {
  port: 5174, // Change to any available port
}
```

**Backend**: Edit `backend/.env`
```env
PORT=3001
```

### API Keys Not Working

1. Verify your API key is valid
2. Check that it's properly set in `backend/.env`
3. Restart the backend server
4. Check backend logs for specific error messages

### Dependencies Issues

```bash
# Clear all node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules shared/node_modules
npm run install:all
```

### Build Errors

```bash
# Rebuild shared package
cd shared
npm run build
cd ..
```

## 📚 Next Steps

- Explore different project templates
- Try different AI providers
- Check the full README.md for advanced features
- Customize the UI and add your own features

## 🆘 Getting Help

- Check [README.md](./README.md) for detailed documentation
- Review [backend/src/config/index.ts](./backend/src/config/index.ts) for all configuration options
- Check browser console and backend logs for error messages

## ⚡ Pro Tips

1. **Multi-file projects**: Use the file tree to navigate between files
2. **Hot reload**: Changes are reflected instantly in the preview
3. **AI context**: The AI understands your existing code - reference files in your prompts
4. **Keyboard shortcuts**: Cmd/Ctrl+S to save, Cmd/Ctrl+K for command palette
5. **Split panels**: Drag panel edges to resize your workspace

Happy coding! 🎉
