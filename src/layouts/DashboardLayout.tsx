import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { SkyBackground } from '../components/illustrations/SkyBackground';
import { FlightOverlay } from '../features/auth/components/FlightOverlay';
import { useAuth } from '../features/auth/hooks/useAuth';
import { isAdmin } from '../features/auth/types/auth';
import { ProfileModal } from '../features/auth/components/ProfileModal';
import { prefersReducedMotion } from '../utils/motion';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [landing, setLanding] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const admin = isAdmin(user);
  const initial = user?.username.charAt(0).toUpperCase() ?? '?';

  // Al salir se muestra el aterrizaje y la sesión se cierra cuando termina.
  const handleLogout = () => (prefersReducedMotion() ? logout() : setLanding(true));
  return (
    <div className="dashboard">
      <SkyBackground />
      <header className="topbar">
        <div className="row topbar__left">
          <Logo />
          {admin && (
            <nav className="nav" aria-label="Secciones">
              <NavLink to="/dashboard" className="nav__link">
                Inventario
              </NavLink>
              <NavLink to="/usuarios" className="nav__link">
                Usuarios
              </NavLink>
            </nav>
          )}
        </div>
        <div className="row">
          <button
            type="button"
            className="profile-btn"
            onClick={() => setProfileOpen(true)}
            aria-label="Abrir mi perfil"
          >
            <span className="avatar" aria-hidden="true">{initial}</span>
            <span className="muted topbar__user">{user?.username}</span>
          </button>
          <Button variant="ghost" onClick={handleLogout} disabled={landing}>
            {landing ? 'Aterrizando…' : 'Salir'}
          </Button>
        </div>
      </header>
      <main className="container">{children}</main>
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
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
