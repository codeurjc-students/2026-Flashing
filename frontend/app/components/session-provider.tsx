import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { UserDTO } from '~/dtos/UserDTO';
import { getCurrentUser } from '~/services/auth-service';

interface Session {
  user: UserDTO | null;
  loading: boolean;
  setUser: (user: UserDTO | null) => void;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const initialCheck = useRef<Promise<UserDTO> | null>(null);

  useEffect(() => {
    let active = true;
    initialCheck.current ??= getCurrentUser();
    initialCheck.current
      .then((current) => { if (active) setUser(current); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <SessionContext.Provider value={{ user, loading, setUser }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used inside SessionProvider');
  return session;
}
