import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiService, ApiError } from '@/services/api.service';
import type { ApiUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types';

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileInitialized: boolean | null;
  setProfileInitialized: (value: boolean) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<ApiUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileInitialized, setProfileInitialized] = useState<boolean | null>(null);

  const checkProfileStatus = useCallback(async (u: ApiUser) => {
    if (u.role !== 'PROVIDER') {
      setProfileInitialized(true);
      return;
    }
    const endpoint =
      u.provider_kind === 'AGENCY' ? '/users/agency/profile/' : '/users/freelance/profile/';
    try {
      await apiService.get(endpoint);
      setProfileInitialized(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setProfileInitialized(false);
      } else {
        setProfileInitialized(true);
      }
    }
  }, []);

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
      // Don't clear auth on failure — the API service already handles
      // 401 retry with token refresh. If we get here, the token may be
      // temporarily invalid (e.g. cross-origin cookie issue). Trust the
      // stored user/token until an actual API call explicitly fails.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If we have a stored token and user, trust them and skip the
    // eager /users/me/ call that would log the user out on refresh
    // when the token refresh fails (cross-origin cookie issues).
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsLoading(false);
    } else {
      refreshUser();
    }
  }, [refreshUser]);

  // Check profile status when user is available
  useEffect(() => {
    if (user) {
      checkProfileStatus(user);
    } else {
      setProfileInitialized(null);
    }
  }, [user, checkProfileStatus]);

  // When apiService clears auth (token refresh failed), sync React state and
  // redirect to login so the user doesn't appear authenticated without a token.
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setProfileInitialized(null);
      // Hard redirect — clears all TanStack Query cache and component state
      window.location.href = '/login';
    };
    window.addEventListener('session:expired', handleSessionExpired);
    return () => window.removeEventListener('session:expired', handleSessionExpired);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    queryClient.clear();
    const res = await apiService.postPublic<LoginResponse>('/users/login/', credentials);
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('user', JSON.stringify(res.user));
    setUser(res.user);
  }, [queryClient]);

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
    queryClient.clear();
    setUser(null);
    setProfileInitialized(null);
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        profileInitialized,
        setProfileInitialized,
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
