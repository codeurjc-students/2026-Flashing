import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCurrentUser, login, logout } from '~/services/auth-service';

const user = { id: 1, username: 'isi', email: 'isi@example.com', role: 'USER' };
const csrfResponse = () => new Response(JSON.stringify({ headerName: 'X-CSRF-TOKEN', token: 'csrf-token' }));

describe('Cookie authentication service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('logs in with cookies and CSRF without storing JWTs or sending Bearer', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(csrfResponse())
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(user)));

    expect((await login('isi@example.com', 'Password_1')).username).toBe('isi');
    const loginOptions = fetchMock.mock.calls[1][1];
    expect(new Headers(loginOptions?.headers).get('X-CSRF-TOKEN')).toBe('csrf-token');
    expect(loginOptions?.credentials).toBe('same-origin');
    expect(new Headers(fetchMock.mock.calls[2][1]?.headers).has('Authorization')).toBe(false);
    expect(localStorage.length).toBe(0);
  });

  it('renews cookies after a 401 and retries the original request', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(csrfResponse())
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(user)));

    expect((await getCurrentUser()).username).toBe('isi');
    expect(fetchMock.mock.calls[2][0]).toContain('/api/v1/auth/refresh');
    expect(fetchMock.mock.calls[2][1]?.body).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('does not renew or retry when a mutation is rejected by CSRF protection', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(csrfResponse())
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Access is denied' }), { status: 403 }));
    await expect(logout()).rejects.toMatchObject({ status: 403 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
