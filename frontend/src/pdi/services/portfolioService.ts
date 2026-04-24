import api from '@pdi/lib/api';

export interface PortfolioSummary {
  avgObservationScore: number;
  trainingHoursCompleted: number;
  trainingHoursPending: number;
  selfPacedCourses: number;
  assessmentsCompleted: number;
  goalProgress: number;
}

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  date: string;
  score: number | null;
  description: string;
  observerName?: string;
  tags?: string[];
  attachments?: string;
}

export interface PortfolioAchievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags?: string;
  attachments?: string;
}

export const portfolioService = {
  async getSummary(teacherId: string): Promise<PortfolioSummary | null> {
    try {
      const response = await api.get(`/portfolio/${teacherId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      return null;
    }
  },

  async getTimeline(teacherId: string): Promise<TimelineEvent[]> {
    try {
      const response = await api.get(`/portfolio/${teacherId}/timeline`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching portfolio timeline:', error);
      return [];
    }
  },

  async getAchievements(teacherId: string): Promise<PortfolioAchievement[]> {
    try {
      const response = await api.get(`/portfolio/${teacherId}/achievements`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  async createAchievement(teacherId: string, data: Partial<PortfolioAchievement>) {
    try {
      const response = await api.post(`/portfolio/${teacherId}/achievements`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  },

  async updateAchievement(teacherId: string, id: string, data: Partial<PortfolioAchievement>) {
    try {
      const response = await api.put(`/portfolio/${teacherId}/achievements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  },

  async deleteAchievement(teacherId: string, id: string) {
    try {
      const response = await api.delete(`/portfolio/${teacherId}/achievements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  }
};
