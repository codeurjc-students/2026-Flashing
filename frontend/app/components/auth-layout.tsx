import type { ReactNode } from 'react';
import { SiteFooter, SiteHeader } from './site-chrome';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-page">
      <SiteHeader />
      <main className="auth-main content-grid"><div className="auth-card">{children}</div></main>
      <SiteFooter />
    </div>
  );
}
