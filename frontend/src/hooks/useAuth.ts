import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'mentor' | 'admin';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    isLoading: true
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token and get user info
      verifyToken();
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.request('/auth/verify');
      setAuthState(prev => ({
        ...prev,
        user: response.user,
        isLoading: false
      }));
    } catch (error) {
      // Token invalid, try refresh
      await refreshAccessToken();
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await api.refreshToken(refreshToken);
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setAuthState(prev => ({
        ...prev,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isLoading: false
      }));
    } catch (error) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setAuthState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isLoading: false
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData: { fullName: string; email: string; password: string; role?: string }) => {
    try {
      const response = await api.register(userData);
      
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      setAuthState({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        isLoading: false
      });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false
      });
    }
  };

  return {
    user: authState.user,
    isAuthenticated: !!authState.user,
    isAdmin: authState.user?.role === 'admin',
    isMentor: authState.user?.role === 'mentor',
    isLoading: authState.isLoading,
    login,
    register,
    logout,
    refreshAccessToken
  };
};