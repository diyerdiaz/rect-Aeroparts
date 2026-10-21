import { useDeferredValue, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { SearchIcon } from '../components/icons';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ProfileModal } from '../features/auth/components/ProfileModal';
import { UsersTable } from '../features/users/components/UsersTable';
import { useUsers } from '../features/users/hooks/useUsers';
import type { UserRecord } from '../features/users/types/user';
import { DashboardLayout } from '../layouts/DashboardLayout';

export default function UsersPage() {
  const { user } = useAuth();
  const { users, loading, error, reload, replace } = useUsers();
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.username, u.email, u.full_name ?? '', u.role].some((v) => v.toLowerCase().includes(q)),
    );
  }, [users, deferredQuery]);

  const active = users.filter((u) => u.is_active).length;
  const admins = users.filter((u) => u.role === 'admin').length;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="title">Usuarios</h1>
          <p className="muted">
            {loading
              ? 'Cargando usuarios…'
              : `${users.length} registrados · ${active} activos · ${admins} administradores`}
          </p>
        </div>
        <Button variant="ghost" onClick={() => setProfileOpen(true)}>
          Mi perfil
        </Button>
      </div>

      <label className="search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Buscar por usuario, nombre, correo o rol"
          aria-label="Buscar usuarios"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {error ? (
        <div className="card notice" role="alert">
          <p className="error">{error}</p>
          <Button variant="ghost" onClick={reload}>
            Reintentar
          </Button>
        </div>
      ) : loading ? (
        <p className="muted loading">Cargando…</p>
      ) : (
        <UsersTable users={filtered} currentUserId={user?.id} />
      )}

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} onSaved={(u) => replace(u as UserRecord)} />
    </DashboardLayout>
  );
}
