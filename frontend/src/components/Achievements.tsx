import React, { useEffect, useState } from 'react';
import { Trophy, Target, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';
import type { Achievement, UserStats } from '@ai-dev-platform/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function Achievements() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, achievementsRes] = await Promise.all([
        axios.get(`${API_URL}/api/gamification/stats`, { headers }),
        axios.get(`${API_URL}/api/gamification/achievements`, { headers }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (achievementsRes.data.success) {
        setAchievements(achievementsRes.data.data.achievements);
      }
    } catch (error) {
      console.error('Load achievements error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'text-orange-600',
      silver: 'text-slate-400',
      gold: 'text-yellow-500',
      platinum: 'text-cyan-400',
      diamond: 'text-purple-400',
    };
    return colors[tier as keyof typeof colors] || 'text-slate-400';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Level {stats.level}</h2>
              <p className="text-purple-100">Keep coding to level up!</p>
            </div>
            <Trophy className="w-12 h-12 opacity-80" />
          </div>

          {/* XP Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{stats.xp} XP</span>
              <span>{stats.nextLevelXp} XP</span>
            </div>
            <div className="h-3 bg-purple-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <div className="text-sm text-purple-100">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.aiGenerations}</div>
              <div className="text-sm text-purple-100">AI Gens</div>
            </div>
            <div>
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                {stats.currentStreak}
                <span className="text-orange-400">🔥</span>
              </div>
              <div className="text-sm text-purple-100">Day Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>

        <div className="grid gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all ${
                achievement.unlocked
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-slate-900 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${getTierColor(achievement.tier)}`}>
                      {achievement.tier}
                    </span>
                    <span className="text-xs text-yellow-500">+{achievement.points} XP</span>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>
                        {achievement.progress || 0} / {achievement.requirement}
                      </span>
                      <span>
                        {Math.round(
                          ((achievement.progress || 0) / achievement.requirement) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            ((achievement.progress || 0) / achievement.requirement) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
