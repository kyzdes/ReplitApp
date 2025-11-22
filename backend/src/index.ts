import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { setupWebSocket } from './websocket';
import aiRoutes from './routes/ai';
import { executionRouter } from './routes/execution';
import projectsRoutes from './routes/projects';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    environment: config.server.env,
  });
});

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/execute', executionRouter);
app.use('/api/projects', projectsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(config.server.env === 'development' && { stack: err.stack }),
    },
  });
});

// Setup WebSocket
const io = setupWebSocket(httpServer);

// Start server
httpServer.listen(config.server.port, config.server.host, () => {
  console.log('');
  console.log('🚀 AI Dev Platform Backend');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Environment:  ${config.server.env}`);
  console.log(`HTTP Server:  http://${config.server.host}:${config.server.port}`);
  console.log(`WebSocket:    ws://${config.server.host}:${config.server.port}`);
  console.log(`CORS Origin:  ${config.server.corsOrigin}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

export { app, httpServer, io };
