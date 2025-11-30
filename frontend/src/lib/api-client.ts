import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  authToken = null;
  delete apiClient.defaults.headers.common['Authorization'];
};

// API methods
export const api = {
  // Auth
  register: (data: any) => apiClient.post('/users/register', data),
  login: (data: any) => apiClient.post('/users/login', data),
  
  // Success Stories
  getSuccessStories: () => apiClient.get('/success-stories'),
  createSuccessStory: (data: any) => apiClient.post('/success-stories', data),
  
  // Notifications
  getNotifications: (userId: string) => apiClient.get(`/notifications/${userId}`),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  
  // Admin
  getAdminStats: () => apiClient.get('/admin/stats'),
  getPendingApprovals: () => apiClient.get('/admin/pending-approvals'),
  approveItem: (type: string, id: string) => apiClient.put(`/admin/approve/${type}/${id}`),
};

export default apiClient;