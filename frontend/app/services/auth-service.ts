import type { UserDTO } from '~/dtos/UserDTO';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
interface CsrfToken {
  headerName: string;
  token: string;
}

export interface RegisterUser {
  username: string;
  displayName: string;
  email: string;
  password: string;
  timezone: string;
  launchUpdates?: boolean;
}

export interface NotificationPreferences {
  launchUpdates: boolean;
}

export interface UpdateUser {
  username: string;
  displayName: string;
  timezone: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function registerUser(data: RegisterUser): Promise<UserDTO> {
  return request<UserDTO>('/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, false);
}

export async function login(email: string, password: string): Promise<UserDTO> {
  await request<void>('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }, false);
  return getCurrentUser();
}

export async function getCurrentUser(): Promise<UserDTO> {
  return request<UserDTO>('/api/v1/users/me');
}

export async function updateCurrentUser(data: UpdateUser): Promise<UserDTO> {
  return request<UserDTO>('/api/v1/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteCurrentUser(): Promise<void> {
  await request<void>('/api/v1/users/me', { method: 'DELETE' });
}

export async function updateNotificationPreferences(data: NotificationPreferences): Promise<UserDTO> {
  return request<UserDTO>('/api/v1/users/me/notifications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function logout(): Promise<void> {
  await request<void>('/api/v1/auth/logout', { method: 'POST' }, false);
}

async function request<T>(path: string, options: RequestInit = {}, authenticated = true): Promise<T> {
  let response = await send(path, options);
  if (authenticated && response.status === 401 && await renewSession()) {
    response = await send(path, options);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new ApiError(response.status, body?.message ?? `Error ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function send(path: string, options: RequestInit): Promise<Response> {
  const headers = new Headers(options.headers);
  const method = (options.method ?? 'GET').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/csrf`, {
      credentials: 'same-origin',
      cache: 'no-store',
    });
    if (!response.ok) throw new ApiError(response.status, 'No se ha podido preparar la petición.');
    const csrf = await response.json() as CsrfToken;
    headers.set(csrf.headerName, csrf.token);
  }
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: 'same-origin' });
}

async function renewSession(): Promise<boolean> {
  const response = await send('/api/v1/auth/refresh', { method: 'POST' });
  return response.ok;
}
