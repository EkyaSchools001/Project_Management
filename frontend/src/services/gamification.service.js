import api from './api.client';

export const gamificationService = {
  async getBadges() {
    const response = await api.get('/gamification/badges');
    return response.data.data;
  },

  async getBadgeById(id) {
    const response = await api.get(`/gamification/badges/${id}`);
    return response.data.data;
  },

  async getEarnedBadges(userId) {
    const response = await api.get('/gamification/badges/earned', { params: { userId } });
    return response.data.data;
  },

  async getUnearnedBadges(userId) {
    const response = await api.get('/gamification/badges/unearned', { params: { userId } });
    return response.data.data;
  },

  async getAchievements() {
    const response = await api.get('/gamification/achievements');
    return response.data.data;
  },

  async getEarnedAchievements(userId) {
    const response = await api.get('/gamification/achievements/earned', { params: { userId } });
    return response.data.data;
  },

  async getUserStats(userId) {
    const response = await api.get('/gamification/stats', { params: { userId } });
    return response.data.data;
  },

  async getProgress() {
    const response = await api.get('/gamification/progress');
    return response.data.data;
  },

  async getLeaderboard(period = 'Weekly', limit = 50) {
    const response = await api.get('/gamification/leaderboard', { params: { period, limit } });
    return response.data.data;
  },

  async getPointsHistory(source, limit = 50) {
    const response = await api.get('/gamification/points-history', { params: { source, limit } });
    return response.data.data;
  },

  async getLevels() {
    const response = await api.get('/gamification/levels');
    return response.data.data;
  },

  async getActiveChallenges() {
    const response = await api.get('/gamification/challenges');
    return response.data.data;
  },

  async getUserChallenges(userId) {
    const response = await api.get('/gamification/challenges/user', { params: { userId } });
    return response.data.data;
  },

  async joinChallenge(challengeId) {
    const response = await api.post('/gamification/challenges/join', { challengeId });
    return response.data.data;
  },

  async updateChallengeProgress(challengeId, progress) {
    const response = await api.patch('/gamification/challenges/progress', { challengeId, progress });
    return response.data.data;
  },

  async completeChallenge(challengeId) {
    const response = await api.post('/gamification/challenges/complete', { challengeId });
    return response.data.data;
  },

  async awardBadge(userId, badgeId) {
    const response = await api.post('/gamification/badges/award', { userId, badgeId });
    return response.data.data;
  },

  async seedData() {
    const response = await api.post('/gamification/seed');
    return response.data;
  }
};

export default gamificationService;