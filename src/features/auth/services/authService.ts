import { ApiError, http, TOKEN_KEY } from '../../../services/httpClient';
import type { Credentials, Session, User } from '../types/auth';

/** Usuario o contraseña incorrectos (no se indica cuál, para no revelar qué usuarios existen). */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Usuario o contraseña incorrectos');
  }
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

export async function login(credentials: Credentials): Promise<Session> {
  let token: TokenResponse;
  try {
    token = await http<TokenResponse>('/api/auth/login/json', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 400 || e.status === 422))
      throw new InvalidCredentialsError();
    throw e;
  }
  localStorage.setItem(TOKEN_KEY, token.access_token);
  try {
    return { token: token.access_token, user: await me() };
  } catch (e) {
    localStorage.removeItem(TOKEN_KEY);
    throw e;
  }
}

export const me = () => http<User>('/api/auth/me');

export interface ProfileInput {
  username: string;
  email: string;
  full_name: string | null;
}

interface ProfileUpdateResponse {
  user: User;
  access_token: string;
}

/**
 * Actualiza el perfil propio. El token lleva el nombre de usuario, así que el servidor
 * devuelve uno nuevo y se guarda para no perder la sesión.
 */
export async function updateMe(data: ProfileInput): Promise<User> {
  const res = await http<ProfileUpdateResponse>('/api/auth/me', { method: 'PUT', body: JSON.stringify(data) });
  localStorage.setItem(TOKEN_KEY, res.access_token);
  return res.user;
}

export const changePassword = (current_password: string, new_password: string) =>
  http<void>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password, new_password }),
  });
