import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_KEY = 'flashing.refreshToken';
let accessToken: string | null = null;
let refreshing: Promise<void> | null = null;
let closing: Promise<void> | null = null;

export interface CurrentUser {
  displayName: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function apiUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  let url = configured;
  if (!url && __DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri ? new URL(`http://${hostUri}`).hostname
      : Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    url = `http://${host}:8080`;
  }
  if (!url) throw new Error('Falta configurar la dirección del servidor de Flashing.');
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && !(__DEV__ && parsed.protocol === 'http:')) {
    throw new Error('Se necesita una conexión HTTPS con Flashing.');
  }
  return url;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${apiUrl()}${path}`, {
      ...options, credentials: 'omit', signal: controller.signal,
    });
    if (!response.ok) {
      let message = 'No se ha podido completar la petición. Inténtalo de nuevo.';
      if (response.status === 401) {
        message = path === '/api/v1/auth/mobile/login'
          ? 'Revisa tu correo y contraseña.'
          : 'Tu sesión ha caducado. Vuelve a iniciar sesión.';
      }
      throw new ApiError(response.status, message);
    }
    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function saveTokens(tokens: Tokens) {
  await SecureStore.setItemAsync(REFRESH_KEY, tokens.refreshToken, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  accessToken = tokens.accessToken;
}

async function clearTokens() {
  accessToken = null;
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

async function refresh() {
  if (closing) throw new ApiError(401, 'Se está cerrando la sesión.');
  if (!refreshing) {
    refreshing = (async () => {
      const token = await SecureStore.getItemAsync(REFRESH_KEY);
      if (!token) throw new ApiError(401, 'Inicia sesión para continuar.');
      try {
        const tokens = await request<Tokens>('/api/v1/auth/mobile/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token }),
        });
        await saveTokens(tokens);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) await clearTokens();
        throw error;
      }
    })().finally(() => { refreshing = null; });
  }
  await refreshing;
}

export async function authenticatedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!accessToken) await refresh();
  const sentToken = accessToken;
  const send = (token: string | null) => {
    if (!token || closing) throw new ApiError(401, 'Inicia sesión para continuar.');
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return request<T>(path, { ...options, headers });
  };
  try {
    return await send(sentToken);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    // Otra petición pudo haber renovado mientras esta recibía el 401.
    if (!accessToken || accessToken === sentToken) await refresh();
    return send(accessToken);
  }
}

export async function login(email: string, password: string): Promise<CurrentUser> {
  const tokens = await request<Tokens>('/api/v1/auth/mobile/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  await saveTokens(tokens);
  try {
    return await authenticatedRequest<CurrentUser>('/api/v1/users/me');
  } catch (error) {
    await clearTokens();
    throw error;
  }
}

export async function restoreSession(): Promise<CurrentUser | null> {
  if (!await SecureStore.getItemAsync(REFRESH_KEY)) return null;
  try {
    return await authenticatedRequest<CurrentUser>('/api/v1/users/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function logout() {
  if (!closing) {
    closing = (async () => {
      await refreshing?.catch(() => {});
      const token = await SecureStore.getItemAsync(REFRESH_KEY);
      if (token) {
        await request<void>('/api/v1/auth/mobile/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token }),
        });
      }
      await clearTokens();
    })().finally(() => { closing = null; });
  }
  await closing;
}
