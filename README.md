# 🚀 AI Dev Platform

Полнофункциональная веб-платформа для интерактивной разработки с использованием AI.

## ✨ Возможности

- 🤖 **Multi-AI Provider Support**: OpenAI, Anthropic, Google Gemini, Mistral, Ollama
- 💻 **Monaco Editor**: Профессиональный редактор кода с подсветкой синтаксиса
- ⚡ **Live Preview**: Мгновенное отображение результатов в iframe sandbox
- 🔄 **Real-time Collaboration**: WebSocket для синхронизации в реальном времени
- 🎨 **Modern UI**: React + shadcn/ui + Tailwind CSS
- 🐳 **Isolated Execution**: Docker контейнеры для безопасного выполнения кода
- 📦 **Project Templates**: Готовые шаблоны React, Vue, Node.js, Python
- 🔐 **Secure**: Sandboxed execution, JWT auth, encrypted storage

## 🏗️ Архитектура

```
ai-dev-platform/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # UI компоненты
│   │   ├── services/     # AI providers, API клиенты
│   │   ├── stores/       # Zustand state management
│   │   ├── hooks/        # React hooks
│   │   └── types/        # TypeScript типы
│   └── package.json
│
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Бизнес логика
│   │   ├── websocket/    # WebSocket сервер
│   │   ├── docker/       # Docker execution
│   │   └── ai/           # AI integration layer
│   └── package.json
│
├── shared/            # Shared типы и утилиты
│   ├── types/
│   └── utils/
│
└── docker/            # Docker конфигурации
    ├── Dockerfile
    └── docker-compose.yml
```

## 🚀 Быстрый старт

### Требования

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (опционально)

### Установка

```bash
# Установка всех зависимостей
npm run install:all

# Запуск в режиме разработки
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Переменные окружения

Создайте `.env` файлы:

**backend/.env**:
```env
PORT=3000
NODE_ENV=development

# AI Providers (опционально)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GOOGLE_AI_API_KEY=your_key_here

# Database (опционально)
DATABASE_URL=postgresql://user:password@localhost:5432/aidevplatform

# Redis (опционально)
REDIS_URL=redis://localhost:6379
```

**frontend/.env**:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

## 📚 Технологический стек

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Code Editor**: Monaco Editor
- **State Management**: Zustand + React Query
- **Real-time**: Socket.io-client
- **Styling**: Tailwind CSS + CSS Modules

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **WebSocket**: Socket.io
- **Container**: Docker SDK
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Storage**: S3-compatible (MinIO/AWS)

### AI Integration
- OpenAI GPT-4 / o1
- Anthropic Claude 3.5
- Google Gemini
- Mistral AI
- Ollama (local models)

## 🎯 Основные фичи

### 1. AI Code Generation
- Генерация кода на основе естественного языка
- Поддержка множества языков программирования
- Контекстно-зависимая генерация
- Стриминг ответов в реальном времени

### 2. Code Editor
- Monaco Editor с IntelliSense
- Множественные файлы и табы
- Syntax highlighting для всех популярных языков
- Code formatting и linting
- Vim/Emacs keybindings

### 3. Live Preview
- Iframe sandbox для безопасности
- Hot reload при изменениях
- Console output в реальном времени
- Network monitoring
- Error tracking

### 4. Project Management
- Создание проектов из шаблонов
- Файловая система
- Git-like версионирование
- Export/Import проектов

### 5. Security
- Sandboxed code execution
- Resource limits (CPU/Memory)
- Network isolation
- JWT authentication
- Input sanitization

## 🔧 API Endpoints

### Projects
```
GET    /api/projects          # Список проектов
POST   /api/projects          # Создать проект
GET    /api/projects/:id      # Получить проект
PUT    /api/projects/:id      # Обновить проект
DELETE /api/projects/:id      # Удалить проект
```

### AI Generation
```
POST   /api/ai/generate       # Генерация кода
POST   /api/ai/chat           # Chat с AI
POST   /api/ai/explain        # Объяснение кода
POST   /api/ai/fix            # Исправление ошибок
```

### Execution
```
POST   /api/execute           # Выполнить код
GET    /api/execute/:id       # Статус выполнения
DELETE /api/execute/:id       # Остановить выполнение
```

### WebSocket Events
```
connect                        # Подключение
disconnect                     # Отключение
code:generate                  # Генерация кода
code:update                    # Обновление кода
execution:start                # Начало выполнения
execution:output               # Вывод выполнения
execution:complete             # Завершение
```

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🐳 Docker Deployment

```bash
# Build образы
docker-compose build

# Запуск
docker-compose up -d

# Логи
docker-compose logs -f

# Остановка
docker-compose down
```

## 📊 Мониторинг

- Логирование: Winston
- Метрики: Prometheus
- Tracing: OpenTelemetry
- Error tracking: Sentry (опционально)

## 🤝 Contributing

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Monaco Editor by Microsoft
- shadcn/ui components
- OpenAI, Anthropic, Google for AI APIs
- Docker for containerization

## 📞 Support

- Issues: [GitHub Issues](https://github.com/yourusername/ai-dev-platform/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/ai-dev-platform/discussions)

---

Made with ❤️ by AI Dev Platform Team
