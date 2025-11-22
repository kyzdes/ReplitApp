import { Router, Request, Response } from 'express';
import { AchievementService } from '../services/achievements';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const achievementService = new AchievementService();

// Get user stats
router.get('/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await achievementService.getUserStats(req.user!.id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Get user achievements
router.get('/achievements', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await achievementService.getUserAchievements(req.user!.id);

    res.json({
      success: true,
      data: { achievements },
    });
  } catch (error: any) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

// Get leaderboard
router.get('/leaderboard/:period?', async (req: Request, res: Response) => {
  try {
    const period = (req.params.period || 'weekly') as 'daily' | 'weekly' | 'monthly' | 'allTime';
    const leaderboard = await achievementService.getLeaderboard(period);

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
});

export default router;
