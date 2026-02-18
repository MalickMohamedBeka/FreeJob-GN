/**
 * API Service
 * Centralized API communication layer with JWT authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(auth = true): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) return undefined as T;

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        response.status,
        response.ok ? 'Réponse invalide du serveur' : `Erreur ${response.status}`,
      );
    }

    if (!response.ok) {
      const message =
        (data as Record<string, unknown>)?.detail as string ||
        (data && typeof data === 'object' && !Array.isArray(data)
          ? Object.values(data as Record<string, unknown>).flat().join(', ')
          : 'Une erreur est survenue');
      throw new ApiError(response.status, message, data);
    }

    return data as T;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    params?: Record<string, string>,
    retry = true,
    auth = true,
  ): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') searchParams.append(key, value);
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    const options: RequestInit = {
      method,
      headers: this.getHeaders(auth),
      credentials: 'include',
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.status === 401 && retry) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        return this.request<T>(method, endpoint, body, params, false);
      }
      this.clearAuth();
      throw new ApiError(401, 'Session expirée');
    }

    return this.handleResponse<T>(response);
  }

  private async tryRefresh(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}/users/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) return false;

        const data = await response.json();
        if (data.access) {
          localStorage.setItem('access_token', data.access);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  /** POST without Authorization header — for public endpoints like register/login */
  async postPublic<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data, undefined, true, false);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('PATCH', endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  /** PATCH with multipart/form-data — for file uploads (profile picture, documents) */
  async patchFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: formData,
    });

    if (response.status === 401) {
      const refreshed = await this.tryRefresh();
      if (refreshed) return this.patchFormData<T>(endpoint, formData);
      this.clearAuth();
      throw new ApiError(401, 'Session expirée');
    }

    return this.handleResponse<T>(response);
  }

  /** POST with multipart/form-data — for file uploads (documents) */
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    });

    if (response.status === 401) {
      const refreshed = await this.tryRefresh();
      if (refreshed) return this.postFormData<T>(endpoint, formData);
      this.clearAuth();
      throw new ApiError(401, 'Session expirée');
    }

    return this.handleResponse<T>(response);
  }
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiService = new ApiService();
