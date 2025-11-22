import { Router, Request, Response } from 'express';
import { CodeExecutor } from '../services/execution/executor';
import { ExecutionRequest } from '@ai-dev-platform/shared';

const router = Router();
const executor = new CodeExecutor();

// Execute code
router.post('/', async (req: Request, res: Response) => {
  try {
    const request: ExecutionRequest = req.body;

    if (!request.code || !request.language) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code and language are required' },
      });
    }

    const executionId = await executor.execute(request);

    res.json({
      success: true,
      data: { executionId },
    });
  } catch (error: any) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Get execution result
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = executor.getResult(id);

  if (!result) {
    return res.status(404).json({
      success: false,
      error: { message: 'Execution not found' },
    });
  }

  res.json({
    success: true,
    data: result,
  });
});

// Cancel execution
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const cancelled = executor.cancel(id);

  if (!cancelled) {
    return res.status(404).json({
      success: false,
      error: { message: 'Execution not found or already completed' },
    });
  }

  res.json({
    success: true,
    data: { cancelled: true },
  });
});

export { router as executionRouter, executor };
