import { useCallback, useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import type { UserRecord } from '../types/user';

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await usersService.getUsers());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /** Reemplaza un usuario en la lista sin volver a pedirla. */
  const replace = useCallback((user: UserRecord) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
  }, []);

  return { users, loading, error, reload: load, replace };
}
