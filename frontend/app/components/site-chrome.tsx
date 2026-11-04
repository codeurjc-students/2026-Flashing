import { Link } from 'react-router';
import { useSession } from './session-provider';

export function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg>;
}

export function Brand() {
  return <Link className="brand" to="/" aria-label="Flashing, inicio"><img src="/branding/flashing.svg" alt="" width="20" height="30" />flashing</Link>;
}

export function SiteHeader({ landing = false }: { landing?: boolean }) {
  const { user } = useSession();
  return (
    <header className="site-header content-grid">
      <div className="header-inner">
        <Brand />
        <nav className="site-nav" aria-label="Navegación principal">
          <Link className="how-link" to="/#how">Cómo funciona</Link>
          <Link to={user ? '/welcome' : '/login'}>{user ? 'Tu cuenta' : 'Entrar'}</Link>
          {(landing || !user) && <Link className="nav-cta" to={landing ? '#download' : '/register'}>
            {landing ? 'Consigue la app' : 'Crear cuenta'} <ArrowIcon />
          </Link>}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer content-grid">
      <div className="footer-inner">
        <Brand />
        <span>Haz espacio para lo inesperado.</span>
        <div className="footer-links"><Link to="/privacy">Privacidad</Link><span>© {new Date().getFullYear()} Flashing</span></div>
      </div>
    </footer>
  );
}
