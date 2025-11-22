import { Router, Request, Response } from 'express';
import { AIVisionService } from '../services/ai/vision';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import prisma from '../db/prisma';

const router = Router();
router.use(optionalAuth);

const visionService = new AIVisionService();

// Screenshot to Code
router.post('/screenshot-to-code', async (req: AuthRequest, res: Response) => {
  try {
    const { imageUrl, imageBase64, framework, style } = req.body;

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({
        success: false,
        error: { message: 'Image URL or base64 data is required' },
      });
    }

    const result = await visionService.screenshotToCode({
      imageUrl,
      imageBase64,
      framework,
      style,
    });

    // Log analytics
    if (req.user) {
      await prisma.analytics.create({
        data: {
          eventType: 'screenshot_to_code',
          userId: req.user.id,
          metadata: { framework, style },
        },
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Screenshot to code error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

export default router;
