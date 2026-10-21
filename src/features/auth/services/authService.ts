import { ApiError, http, TOKEN_KEY } from '../../../services/httpClient';
import type { Credentials, Session, User } from '../types/auth';

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
      throw new Error('Usuario o contraseña incorrectos');
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
