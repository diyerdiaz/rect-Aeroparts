export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  role: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Session {
  user: User;
  token: string;
}
