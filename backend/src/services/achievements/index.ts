import { Achievement, UserStats, AchievementTier } from '@ai-dev-platform/shared';
import prisma from '../../db/prisma';

const ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  // Coding Achievements
  {
    id: 'first-project',
    name: 'Hello World',
    description: 'Create your first project',
    icon: '👋',
    category: 'coding',
    tier: 'bronze',
    points: 10,
    requirement: 1,
  },
  {
    id: 'project-master',
    name: 'Project Master',
    description: 'Create 10 projects',
    icon: '🏆',
    category: 'coding',
    tier: 'gold',
    points: 100,
    requirement: 10,
  },
  {
    id: 'code-warrior',
    name: 'Code Warrior',
    description: 'Write 10,000 lines of code',
    icon: '⚔️',
    category: 'coding',
    tier: 'platinum',
    points: 500,
    requirement: 10000,
  },

  // AI Achievements
  {
    id: 'ai-curious',
    name: 'AI Curious',
    description: 'Use AI generation for the first time',
    icon: '🤖',
    category: 'ai',
    tier: 'bronze',
    points: 10,
    requirement: 1,
  },
  {
    id: 'ai-wizard',
    name: 'AI Wizard',
    description: 'Generate code with AI 100 times',
    icon: '🧙',
    category: 'ai',
    tier: 'gold',
    points: 200,
    requirement: 100,
  },
  {
    id: 'ai-master',
    name: 'AI Master',
    description: 'Generate code with AI 1000 times',
    icon: '🎓',
    category: 'ai',
    tier: 'diamond',
    points: 1000,
    requirement: 1000,
  },

  // Streak Achievements
  {
    id: 'consistent',
    name: 'Consistent',
    description: '7 day coding streak',
    icon: '🔥',
    category: 'coding',
    tier: 'silver',
    points: 50,
    requirement: 7,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: '30 day coding streak',
    icon: '💪',
    category: 'coding',
    tier: 'gold',
    points: 200,
    requirement: 30,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: '100 day coding streak',
    icon: '🌟',
    category: 'coding',
    tier: 'diamond',
    points: 1000,
    requirement: 100,
  },

  // Deployment Achievements
  {
    id: 'first-deploy',
    name: 'Ship It!',
    description: 'Deploy your first project',
    icon: '🚀',
    category: 'deployment',
    tier: 'bronze',
    points: 25,
    requirement: 1,
  },
  {
    id: 'deployment-pro',
    name: 'Deployment Pro',
    description: 'Deploy 10 projects',
    icon: '🎯',
    category: 'deployment',
    tier: 'gold',
    points: 150,
    requirement: 10,
  },

  // Social Achievements
  {
    id: 'popular',
    name: 'Popular',
    description: 'Get 10 stars on your projects',
    icon: '⭐',
    category: 'social',
    tier: 'silver',
    points: 75,
    requirement: 10,
  },
  {
    id: 'influencer',
    name: 'Influencer',
    description: 'Get 100 stars on your projects',
    icon: '🌟',
    category: 'social',
    tier: 'platinum',
    points: 500,
    requirement: 100,
  },
];

export class AchievementService {
  async getUserStats(userId: string): Promise<UserStats> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        projects: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate stats from analytics
    const aiGenerations = await prisma.analytics.count({
      where: {
        userId,
        eventType: {
          in: ['ai_generation', 'ai_explain_code', 'ai_debug_code'],
        },
      },
    });

    // Calculate total lines (simplified)
    const totalLines = user.projects.reduce((acc, project) => {
      // Estimate based on files
      return acc + (project.id.length * 100); // placeholder
    }, 0);

    // XP calculation: 10 XP per project, 1 XP per AI generation, etc.
    const xp = (user._count.projects * 10) + aiGenerations;
    const level = Math.floor(xp / 100) + 1;
    const nextLevelXp = level * 100;

    return {
      userId,
      totalProjects: user._count.projects,
      totalLines,
      aiGenerations,
      daysActive: 1, // Placeholder
      currentStreak: 0, // Placeholder
      longestStreak: 0, // Placeholder
      deploymentsCount: 0, // Placeholder
      forksReceived: 0, // Placeholder
      starsReceived: 0, // Placeholder
      level,
      xp,
      nextLevelXp,
    };
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const stats = await this.getUserStats(userId);

    return ACHIEVEMENTS.map(achievement => {
      let progress = 0;
      let unlocked = false;

      switch (achievement.id) {
        case 'first-project':
        case 'project-master':
          progress = stats.totalProjects;
          break;
        case 'code-warrior':
          progress = stats.totalLines;
          break;
        case 'ai-curious':
        case 'ai-wizard':
        case 'ai-master':
          progress = stats.aiGenerations;
          break;
        case 'consistent':
        case 'dedicated':
        case 'unstoppable':
          progress = stats.currentStreak;
          break;
        case 'first-deploy':
        case 'deployment-pro':
          progress = stats.deploymentsCount;
          break;
        case 'popular':
        case 'influencer':
          progress = stats.starsReceived;
          break;
      }

      unlocked = progress >= achievement.requirement;

      return {
        ...achievement,
        progress,
        unlocked,
        unlockedAt: unlocked ? Date.now() : undefined,
      };
    });
  }

  async checkAndUnlockAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await this.getUserAchievements(userId);
    const newlyUnlocked = achievements.filter(a =>
      a.unlocked && a.progress === a.requirement
    );

    // Log newly unlocked achievements
    for (const achievement of newlyUnlocked) {
      await prisma.analytics.create({
        data: {
          eventType: 'achievement_unlocked',
          userId,
          metadata: {
            achievementId: achievement.id,
            points: achievement.points,
          },
        },
      });
    }

    return newlyUnlocked;
  }

  async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'allTime' = 'weekly') {
    // Simplified leaderboard based on project count
    const users = await prisma.user.findMany({
      take: 100,
      select: {
        id: true,
        username: true,
        avatar: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        projects: {
          _count: 'desc',
        },
      },
    });

    return {
      period,
      users: users.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        score: user._count.projects,
        change: 0, // Placeholder
      })),
    };
  }
}
