import { useState, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { SkyBackground } from '../components/illustrations/SkyBackground';
import { FlightOverlay } from '../features/auth/components/FlightOverlay';
import { useAuth } from '../features/auth/hooks/useAuth';
import { prefersReducedMotion } from '../utils/motion';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [landing, setLanding] = useState(false);
  const initial = user?.username.charAt(0).toUpperCase() ?? '?';

  // Al salir se muestra el aterrizaje y la sesión se cierra cuando termina.
  const handleLogout = () => (prefersReducedMotion() ? logout() : setLanding(true));
  return (
    <div className="dashboard">
      <SkyBackground />
      <header className="topbar">
        <Logo />
        <div className="row">
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span className="muted topbar__user">{user?.username}</span>
          <Button variant="ghost" onClick={handleLogout} disabled={landing}>
            {landing ? 'Aterrizando…' : 'Salir'}
          </Button>
        </div>
      </header>
      <main className="container">{children}</main>
      {landing && (
        <>
          <span className="sr-only" role="status">
            Cerrando sesión.
          </span>
          <FlightOverlay mode="landing" onDone={logout} />
        </>
      )}
    </div>
  );
}
