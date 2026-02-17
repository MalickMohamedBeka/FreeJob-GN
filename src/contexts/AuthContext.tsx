import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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

function isFreelanceProvider(user: ApiUser | null): boolean {
  return user?.role === 'PROVIDER' && user?.provider_kind === 'FREELANCE';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [profileInitialized, setProfileInitialized] = useState<boolean | null>(null);

  const checkProfileStatus = useCallback(async (u: ApiUser) => {
    if (!isFreelanceProvider(u)) {
      setProfileInitialized(true);
      return;
    }
    try {
      await apiService.get('/users/freelance/profile/');
      setProfileInitialized(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setProfileInitialized(false);
      } else {
        // Fail-open: don't block on unexpected errors
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
    setProfileInitialized(null);
  }, []);

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
