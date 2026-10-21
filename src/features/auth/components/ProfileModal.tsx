import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { formatDate } from '../../../utils/date';
import { useAuth } from '../hooks/useAuth';
import { changePassword, updateMe } from '../services/authService';
import type { User } from '../types/auth';

type Tab = 'data' | 'password';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: (user: User) => void;
}

/** Perfil del usuario en sesión: datos personales y cambio de contraseña. */
export function ProfileModal({ open, onClose, onSaved }: Props) {
  const [tab, setTab] = useState<Tab>('data');
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Modal open={open} title="Mi perfil" onClose={onClose}>
      <div className="stack">
        <div className="profile__head">
          <span className="avatar avatar--lg" aria-hidden="true">
            {user.username.charAt(0).toUpperCase()}
          </span>
          <div>
            <strong>{user.full_name || user.username}</strong>
            <p className="muted">
              <span className="tag">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
              {user.created_at && <> · Registrado el {formatDate(user.created_at)}</>}
            </p>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Secciones del perfil">
          <button type="button" role="tab" aria-selected={tab === 'data'} className="tabs__tab" onClick={() => setTab('data')}>
            Datos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'password'}
            className="tabs__tab"
            onClick={() => setTab('password')}
          >
            Contraseña
          </button>
        </div>

        {tab === 'data' ? (
          <DataForm user={user} onClose={onClose} onSaved={onSaved} />
        ) : (
          <PasswordForm onClose={onClose} />
        )}
      </div>
    </Modal>
  );
}

function DataForm({ user, onClose, onSaved }: { user: User; onClose: () => void; onSaved?: (user: User) => void }) {
  const { setCurrentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setSaving(true);
    setError('');
    try {
      const updated = await updateMe({
        username: String(d.get('username')).trim(),
        email: String(d.get('email')).trim(),
        full_name: String(d.get('full_name')).trim() || null,
      });
      setCurrentUser(updated);
      onSaved?.(updated);
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <Input
        label="Usuario"
        name="username"
        defaultValue={user.username}
        autoComplete="username"
        minLength={3}
        maxLength={50}
        required
      />
      <Input label="Nombre completo" name="full_name" defaultValue={user.full_name ?? ''} autoComplete="name" />
      <Input label="Correo" name="email" type="email" defaultValue={user.email} autoComplete="email" required />
      <p className="muted hint">Si cambias el usuario, úsalo la próxima vez que inicies sesión. El rol solo lo cambia un administrador.</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="row row--end modal__actions">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}

function PasswordForm({ onClose }: { onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const current = String(d.get('current_password'));
    const next = String(d.get('new_password'));
    setError('');
    setDone(false);
    if (next !== String(d.get('confirm_password'))) {
      setError('La confirmación no coincide con la nueva contraseña');
      return;
    }
    setSaving(true);
    try {
      await changePassword(current, next);
      form.reset();
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <Input label="Contraseña actual" name="current_password" type="password" autoComplete="current-password" required />
      <Input
        label="Nueva contraseña"
        name="new_password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        label="Confirmar nueva contraseña"
        name="confirm_password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <p className="muted hint">Mínimo 8 caracteres y distinta de la actual.</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {done && (
        <p className="success" role="status">
          Contraseña actualizada. Úsala la próxima vez que inicies sesión.
        </p>
      )}
      <div className="row row--end modal__actions">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cerrar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : 'Cambiar contraseña'}
        </Button>
      </div>
    </form>
  );
}
