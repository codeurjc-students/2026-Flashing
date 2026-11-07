import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { restoreSession, logout, type CurrentUser } from './services/auth';

const MobileSession = createContext<{
  user: CurrentUser | null;
  loading: boolean;
  setUser: (user: CurrentUser) => void;
  signOut: () => Promise<void>;
} | null>(null);

export function MobileSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    restoreSession().then(restored => {
      if (active) setUser(restored);
    }).catch(() => {
      // Ante un fallo de red se conserva el token para volver a intentarlo.
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function signOut() {
    await logout();
    setUser(null);
  }

  return (
    <MobileSession.Provider value={{ user, loading, setUser, signOut }}>
      {children}
    </MobileSession.Provider>
  );
}

export function useMobileSession() {
  const session = useContext(MobileSession);
  if (!session) throw new Error('MobileSessionProvider is required');
  return session;
}
