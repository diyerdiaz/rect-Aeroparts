import type { UserRecord } from '../types/user';
import { formatDate } from '../../../utils/date';

interface Props {
  users: UserRecord[];
  currentUserId?: number;
}

export function UsersTable({ users, currentUserId }: Props) {
  if (users.length === 0) return <p className="muted loading">No hay usuarios que coincidan.</p>;
  return (
    <div className="card table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Usuario</th>
            <th scope="col">Correo</th>
            <th scope="col">Rol</th>
            <th scope="col">Estado</th>
            <th scope="col">Registrado</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <div className="user-cell">
                  <span className="avatar" aria-hidden="true">
                    {u.username.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{u.username}</strong>
                    {u.id === currentUserId && <span className="muted"> (tú)</span>}
                    {u.full_name && <div className="muted">{u.full_name}</div>}
                  </div>
                </div>
              </td>
              <td>{u.email}</td>
              <td>
                <span className={`tag ${u.role === 'admin' ? 'tag--strong' : ''}`}>
                  {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
              </td>
              <td>
                <span className={`status ${u.is_active ? 'status--on' : 'status--off'}`}>
                  {u.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="muted nowrap">{formatDate(u.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
