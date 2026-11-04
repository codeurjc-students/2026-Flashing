import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SessionProvider, useSession } from '~/components/session-provider';
import { getCurrentUser } from '~/services/auth-service';

vi.mock('~/services/auth-service', () => ({ getCurrentUser: vi.fn() }));

function SessionProbe() {
  const { user, loading } = useSession();
  return <p>{loading ? 'Checking session' : user?.displayName}</p>;
}

describe('Initial session check', () => {
  it('shares the request across StrictMode effects instead of racing CSRF cookie writes', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 1, username: 'earlybird', displayName: 'Early bird', email: 'bird@example.com',
      role: 'USER', timezone: 'UTC', createdAt: '2026-11-02T12:00:00Z', lastLoginAt: null,
      status: 'ACTIVE', launchUpdates: false,
    });
    render(<StrictMode><SessionProvider><SessionProbe /></SessionProvider></StrictMode>);
    await screen.findByText('Early bird');
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });
});
