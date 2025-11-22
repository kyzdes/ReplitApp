import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import aiRoutes from '../routes/ai';

const app = express();
app.use(express.json());
app.use('/api/ai', aiRoutes);

describe('AI API Routes', () => {
  describe('GET /api/ai/providers', () => {
    it('should return available providers', async () => {
      const response = await request(app)
        .get('/api/ai/providers')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('providers');
      expect(Array.isArray(response.body.data.providers)).toBe(true);
    });
  });

  describe('POST /api/ai/generate', () => {
    it('should return error without provider', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .send({ prompt: 'test' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return error without prompt', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .send({ provider: 'openai' })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('should return error without required fields', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});
