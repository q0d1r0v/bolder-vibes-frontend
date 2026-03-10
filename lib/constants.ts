export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';
export const WS_NAMESPACE = '/ws';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECT: (id: string) => `/project/${id}`,
  ADMIN_USERS: '/admin/users',
} as const;

export const AUTH_COOKIE_NAME = 'bolder-vibes-auth-status';
export const AUTH_STORAGE_KEY = 'bolder-vibes-auth';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const QUERY_KEYS = {
  PROFILE: ['profile'],
  PROJECTS: ['projects'],
  PROJECT: (id: string) => ['project', id],
  TEMPLATES: ['templates'],
  FILES: (projectId: string) => ['files', projectId],
  FILE: (projectId: string, fileId: string) => ['file', projectId, fileId],
  FILE_VERSIONS: (projectId: string, fileId: string) => ['file-versions', projectId, fileId],
  CONVERSATIONS: (projectId: string) => ['conversations', projectId],
  CONVERSATION: (id: string) => ['conversation', id],
  USERS: ['users'],
} as const;
