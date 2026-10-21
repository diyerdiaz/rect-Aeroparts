import type { ReactNode } from 'react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { SkyBackground } from '../components/illustrations/SkyBackground';
import { useAuth } from '../features/auth/hooks/useAuth';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const initial = user?.username.charAt(0).toUpperCase() ?? '?';
  return (
    <div className="dashboard">
      <SkyBackground />
      <header className="topbar">
        <Logo />
        <div className="row">
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span className="muted topbar__user">{user?.username}</span>
          <Button variant="ghost" onClick={logout}>
            Salir
          </Button>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}
