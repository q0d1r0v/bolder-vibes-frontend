import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../constants';
import { getAccessToken, getRefreshToken, setStoredTokens, clearStoredTokens } from '../auth-tokens';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: unwrap backend { data: ... } wrapper
// Skip unwrapping for paginated responses that have a "meta" key
api.interceptors.response.use((response) => {
  if (response.data && 'data' in response.data && !('meta' in response.data)) {
    response.data = response.data.data;
  }
  return response;
});

// 401 refresh logic with promise queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  // Don't retry refresh or login requests
  if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    });
  }

  originalRequest._retry = true;
  isRefreshing = true;

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken }, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;
    setStoredTokens(newAccessToken, newRefreshToken);

    processQueue(null, newAccessToken);

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(originalRequest);
  } catch (refreshError) {
    processQueue(refreshError, null);
    clearStoredTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
});

export default api;
