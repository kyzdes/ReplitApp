import { Router, Request, Response } from 'express';
import { EnhancedAIService } from '../services/ai/enhanced';
import { AIProviderName } from '@ai-dev-platform/shared';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import prisma from '../db/prisma';

const router = Router();

// All routes can work without auth but will track if user is logged in
router.use(optionalAuth);

// Explain code
router.post('/explain', async (req: AuthRequest, res: Response) => {
  try {
    const { code, language, provider = 'anthropic' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code and language are required' },
      });
    }

    const aiService = new EnhancedAIService(provider as AIProviderName);
    const explanation = await aiService.explainCode(code, language);

    // Log to analytics
    if (req.user) {
      await prisma.analytics.create({
        data: {
          eventType: 'ai_explain_code',
          userId: req.user.id,
          metadata: { language, provider },
        },
      });
    }

    res.json({
      success: true,
      data: { explanation },
    });
  } catch (error: any) {
    console.error('Explain code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Debug code
router.post('/debug', async (req: AuthRequest, res: Response) => {
  try {
    const { code, error, language, provider = 'anthropic' } = req.body;

    if (!code || !error || !language) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code, error, and language are required' },
      });
    }

    const aiService = new EnhancedAIService(provider as AIProviderName);
    const solution = await aiService.debugCode(code, error, language);

    // Log to analytics
    if (req.user) {
      await prisma.analytics.create({
        data: {
          eventType: 'ai_debug_code',
          userId: req.user.id,
          metadata: { language, provider },
        },
      });
    }

    res.json({
      success: true,
      data: { solution },
    });
  } catch (error: any) {
    console.error('Debug code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Refactor code
router.post('/refactor', async (req: AuthRequest, res: Response) => {
  try {
    const { code, language, instruction, provider = 'anthropic' } = req.body;

    if (!code || !language || !instruction) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code, language, and instruction are required' },
      });
    }

    const aiService = new EnhancedAIService(provider as AIProviderName);
    const refactoredCode = await aiService.refactorCode(code, language, instruction);

    res.json({
      success: true,
      data: { code: refactoredCode },
    });
  } catch (error: any) {
    console.error('Refactor code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Generate tests
router.post('/generate-tests', async (req: AuthRequest, res: Response) => {
  try {
    const { code, language, provider = 'anthropic' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code and language are required' },
      });
    }

    const aiService = new EnhancedAIService(provider as AIProviderName);
    const tests = await aiService.generateTests(code, language);

    res.json({
      success: true,
      data: { tests },
    });
  } catch (error: any) {
    console.error('Generate tests error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Improve code
router.post('/improve', async (req: AuthRequest, res: Response) => {
  try {
    const { code, language, provider = 'anthropic' } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code and language are required' },
      });
    }

    const aiService = new EnhancedAIService(provider as AIProviderName);
    const result = await aiService.improveCode(code, language);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Improve code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Convert language
router.post('/convert', async (req: AuthRequest, res: Response) => {
  try {
    const { code, fromLanguage, toLanguage, provider = 'anthropic' } = req.body;

    if (!code || !fromLanguage || !toLanguage) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code, fromLanguage, and toLanguage are required' },
      });
    }

    const aiService = new EnhancedAIService(provider as AIProviderName);
    const convertedCode = await aiService.convertLanguage(code, fromLanguage, toLanguage);

    res.json({
      success: true,
      data: { code: convertedCode },
    });
  } catch (error: any) {
    console.error('Convert language error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

export default router;
