export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Session {
  user: User;
  token: string;
}
