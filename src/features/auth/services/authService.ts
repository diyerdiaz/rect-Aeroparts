import { delay } from '../../../services/httpClient';
import type { Credentials, Session } from '../types/auth';

// TODO: reemplazar por http<Session>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
export async function login({ username, password }: Credentials): Promise<Session> {
  await delay(500);
  if (username.trim().length < 3 || password.length < 6) throw new Error('Usuario o contraseña incorrectos');
  return {
    token: crypto.randomUUID(),
    user: { id: '1', name: username.trim(), username: username.trim().toLowerCase() },
  };
}
