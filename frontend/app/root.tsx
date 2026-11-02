import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from 'react-router';
import type { Route } from './+types/root';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav aria-label="Navegación principal">
            <Link to="/">Flashing</Link>{' '}
            <Link to="/login">Iniciar sesión</Link>{' '}
            <Link to="/register">Registro</Link>{' '}
            <Link to="/profile">Mi perfil</Link>
          </nav>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function HydrateFallback() {
  return <p role="status">Cargando aplicación…</p>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Se ha producido un error inesperado.';

  if (isRouteErrorResponse(error)) {
    message = error.status === 404
      ? 'La página solicitada no existe.'
      : `Error ${error.status}: ${error.statusText}`;
  }

  return (
    <main>
      <h1>Error</h1>
      <p role="alert">{message}</p>
    </main>
  );
}
