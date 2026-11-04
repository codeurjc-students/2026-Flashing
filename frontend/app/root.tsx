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
import { SessionProvider } from './components/session-provider';
import './styles/site.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffe500" />
        <link rel="icon" href="/branding/flashing.svg" type="image/svg+xml" />
        <link rel="preload" href="/fonts/ClashDisplay-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <SessionProvider><Outlet /></SessionProvider>;
}

export function HydrateFallback() {
  return <main className="boot-state"><img src="/branding/flashing.svg" alt="Flashing" width="40" height="60" /><p role="status">Un momento…</p></main>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Se ha producido un error inesperado.';

  if (isRouteErrorResponse(error)) {
    message = error.status === 404
      ? 'La página solicitada no existe.'
      : `Error ${error.status}: ${error.statusText}`;
  }

  return (
    <main className="error-page content-grid"><div className="error-content">
      <h1>Error</h1>
      <p role="alert">{message}</p>
      <Link className="pill" to="/">Volver a Flashing</Link>
    </div></main>
  );
}
