export type AchievementCategory = 'coding' | 'ai' | 'social' | 'learning' | 'deployment';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
  points: number;
  requirement: number;
  progress?: number;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface UserStats {
  userId: string;
  totalProjects: number;
  totalLines: number;
  aiGenerations: number;
  daysActive: number;
  currentStreak: number;
  longestStreak: number;
  deploymentsCount: number;
  forksReceived: number;
  starsReceived: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  users: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  change: number; // position change from last period
}
