import { Router, Request, Response } from 'express';
import { AIServiceFactory } from '../services/ai/factory';
import { AIGenerateRequest } from '@ai-dev-platform/shared';

const router = Router();

// Generate code
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const request: AIGenerateRequest = req.body;

    if (!request.provider || !request.prompt) {
      return res.status(400).json({
        success: false,
        error: { message: 'Provider and prompt are required' },
      });
    }

    const service = AIServiceFactory.getService(request.provider);
    const result = await service.generate(request);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Chat with AI
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { provider, messages, options } = req.body;

    if (!provider || !messages) {
      return res.status(400).json({
        success: false,
        error: { message: 'Provider and messages are required' },
      });
    }

    const service = AIServiceFactory.getService(provider);
    const response = await service.chat(messages, options);

    res.json({
      success: true,
      data: { response },
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Get available providers
router.get('/providers', (req: Request, res: Response) => {
  const providers = AIServiceFactory.getAvailableProviders();

  res.json({
    success: true,
    data: { providers },
  });
});

export default router;
