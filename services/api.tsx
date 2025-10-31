import type { User, ModuleStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

// Helper to set auth token
const setAuthToken = (token: string): void => {
  sessionStorage.setItem('authToken', token);
};

// Helper to clear auth token
const clearAuthToken = (): void => {
  sessionStorage.removeItem('authToken');
};

// Helper for authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Authentication API
export const authApi = {
  async register(username: string, password: string, role: 'student' | 'organizer', organizerKey?: string) {
    const data = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, role, organizerKey }),
    });
    
    setAuthToken(data.token);
    return data.user as User;
  },

  async login(username: string, password: string) {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    setAuthToken(data.token);
    return data.user as User;
  },

  logout() {
    clearAuthToken();
  },

  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  }
};

// Course Progress API
export const progressApi = {
  async getProgress(): Promise<{
    moduleStatuses: ModuleStatus[];
    quizResults: Array<{
      moduleId: number;
      score: number;
      total: number;
      passed: boolean;
      completedAt: Date;
    }>;
  }> {
    return fetchWithAuth('/progress');
  },

  async updateProgress(moduleStatuses: ModuleStatus[], quizResult?: {
    moduleId: number;
    score: number;
    total: number;
    passed: boolean;
  }) {
    return fetchWithAuth('/progress', {
      method: 'PUT',
      body: JSON.stringify({ moduleStatuses, quizResult }),
    });
  },

  async getAllProgress() {
    return fetchWithAuth('/progress/all');
  }
};

export { setAuthToken, clearAuthToken };