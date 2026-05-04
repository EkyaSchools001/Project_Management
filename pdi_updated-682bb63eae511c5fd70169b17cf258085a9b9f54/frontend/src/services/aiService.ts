import axios from "axios";

const API_URL = "http://localhost:4000/api/ai";

export const aiService = {
  async recommendPD(teacherContext: string, focusAreas: string[], availableCourses: any[]) {
    const response = await axios.post(`${API_URL}/recommend-pd`, {
      teacher_context: teacherContext,
      focus_areas: focusAreas,
      available_courses: availableCourses
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  },

  async analyzeReflection(text: string) {
    const response = await axios.post(`${API_URL}/analyze-reflection`, { text }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  },

  async scoreEvidence(content: string, category: string) {
    const response = await axios.post(`${API_URL}/score-evidence`, { content, category }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  },

  async sendPDSnapshot(userId: string, email: string, progressData: any) {
    const response = await axios.post(`${API_URL}/send-pd-snapshot`, { 
        userId, 
        email, 
        progressData 
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  },

  async suggestTags(description: string) {
    const response = await axios.post(`${API_URL}/suggest-tags`, { description }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data.data;
  }
};
