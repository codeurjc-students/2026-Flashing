import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieJar } from 'tough-cookie';
import { getCurrentUser, login, logout, registerUser, updateCurrentUser, updateNotificationPreferences } from '~/services/auth-service';

// Node fetch has no browser cookie store; use a real cookie jar for the HTTP transport.
const networkFetch = globalThis.fetch;

describe('Authentication client-server integration', () => {
  beforeEach(() => {
    const jar = new CookieJar();
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, options) => {
      const url = String(input);
      const headers = new Headers(options?.headers);
      const cookie = await jar.getCookieString(url);
      if (cookie) headers.set('Cookie', cookie);
      const response = await networkFetch(input, { ...options, headers });
      for (const value of response.headers.getSetCookie()) {
        await jar.setCookie(value, url);
      }
      return response;
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('registers, logs in and loads the user through the real API', async () => {
    const suffix = Date.now().toString();
    const email = `user${suffix}@example.com`;
    const username = `user${suffix}`;

    const registered = await registerUser({
      username,
      displayName: 'Integration user',
      email,
      password: 'Password_1',
      timezone: 'Europe/Madrid',
      launchUpdates: true,
    });
    expect(registered.role).toBe('USER');
    expect(registered.launchUpdates).toBe(true);

    await login(email, 'Password_1');
    const current = await getCurrentUser();
    expect(current.email).toBe(email);
    expect(current.username).toBe(username);
    expect((await updateCurrentUser({ username, displayName: 'Updated user', timezone: 'Europe/Madrid' }))
      .displayName).toBe('Updated user');
    await updateNotificationPreferences({ launchUpdates: false });
    const preferences = await getCurrentUser();
    expect(preferences.launchUpdates).toBe(false);
    await logout();
    await expect(getCurrentUser()).rejects.toMatchObject({ status: 401 });
  });
});
