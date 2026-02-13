import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiService } from '@/services/api.service';
import type { ApiUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types';

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await apiService.get<ApiUser>('/users/me/');
      setUser(me);
      localStorage.setItem('user', JSON.stringify(me));
    } catch {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const res = await apiService.postPublic<LoginResponse>('/users/login/', credentials);
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    return apiService.postPublic<RegisterResponse>('/users/register/', data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.post('/users/logout/');
    } catch {
      // ignore errors on logout
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
