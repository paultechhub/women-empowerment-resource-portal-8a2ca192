const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : '/api');

class ApiService {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Auth
  login = (credentials: { email: string; password: string }) =>
    this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  
  register = (userData: { fullName: string; email: string; password: string; role?: string }) =>
    this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  
  refreshToken = (refreshToken: string) =>
    this.request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) });
  
  logout = (refreshToken: string) =>
    this.request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) });

  // Courses
  getCourses = () => this.request('/courses');
  enrollCourse = (courseId: string) => this.request(`/courses/${courseId}/enroll`, { method: 'POST' });

  // Mentorship
  getMentors = () => this.request('/mentorship/mentors');
  requestMentorship = (mentorId: string, message: string) =>
    this.request('/mentorship/request', { method: 'POST', body: JSON.stringify({ mentorId, message }) });

  // Resources
  getResources = () => this.request('/resources');
  createResource = (resource: any) => this.request('/resources', { method: 'POST', body: JSON.stringify(resource) });

  // Events
  getEvents = () => this.request('/events');
  joinEvent = (eventId: string) => this.request(`/events/${eventId}/join`, { method: 'POST' });

  // Forum
  getForumPosts = () => this.request('/forum');
  createPost = (post: any) => this.request('/forum', { method: 'POST', body: JSON.stringify(post) });

  // Success Stories
  getSuccessStories = () => this.request('/success-stories');
  createSuccessStory = (story: any) => this.request('/success-stories', { method: 'POST', body: JSON.stringify(story) });

  // Chat
  getChats = () => this.request('/chat');
  sendMessage = (chatId: string, message: string) =>
    this.request('/chat/message', { method: 'POST', body: JSON.stringify({ chatId, message }) });

  // Notifications
  getNotifications = () => this.request('/notifications');
  markAsRead = (notificationId: string) => this.request(`/notifications/${notificationId}/read`, { method: 'PUT' });

  // Admin
  getUsers = () => this.request('/admin/users');
  getAnalytics = () => this.request('/admin/analytics');

  // Jobs
  getJobs = (params?: any) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/jobs${query}`);
  };
  postJob = (jobData: any) => this.request('/jobs', { method: 'POST', body: JSON.stringify(jobData) });
  applyToJob = (jobId: string) => this.request(`/jobs/${jobId}/apply`, { method: 'POST' });

  // Profile
  getProfile = () => this.request('/users/profile');
  updateProfile = (profileData: any) => this.request('/users/profile', { method: 'PUT', body: JSON.stringify(profileData) });

  // Resource Library
  getResourceLibrary = () => this.request('/resources/library');
  addToLibrary = (resourceId: string) => this.request(`/resources/${resourceId}/save`, { method: 'POST' });

  // Real-time features
  getOnlineUsers = () => this.request('/users/online');
  getLiveEvents = () => this.request('/events/live');

  // Analytics for admin
  getUserAnalytics = () => this.request('/admin/users/analytics');
  getCourseAnalytics = () => this.request('/admin/courses/analytics');
  getEngagementMetrics = () => this.request('/admin/engagement');
}

export const api = new ApiService();
export default api;