const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const TOKEN_KEY = 'aeroparts.token';
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

interface ValidationIssue {
  loc?: (string | number)[];
  msg: string;
}

/** Extrae un mensaje legible de las respuestas de error de FastAPI. */
async function errorMessage(res: Response): Promise<string> {
  try {
    const { detail } = (await res.json()) as { detail?: string | ValidationIssue[] };
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length)
      return detail.map((d) => `${d.loc?.[d.loc.length - 1] ?? ''}: ${d.msg}`).join(' · ');
  } catch {
    /* respuesta sin JSON */
  }
  return `Error del servidor (${res.status})`;
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0);
  }

  // Token vencido o inválido: se avisa para cerrar la sesión.
  if (res.status === 401 && token) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  if (!res.ok) throw new ApiError(await errorMessage(res), res.status);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
