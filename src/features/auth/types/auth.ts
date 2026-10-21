export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  role: string;
  is_active?: number;
  created_at?: string;
}

export const isAdmin = (user: User | null) => user?.role === 'admin';

export interface Credentials {
  username: string;
  password: string;
}

export interface Session {
  user: User;
  token: string;
}
