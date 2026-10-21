const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('aeroparts.token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<T>;
}

/** Simula latencia de red mientras no exista backend. */
export const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
