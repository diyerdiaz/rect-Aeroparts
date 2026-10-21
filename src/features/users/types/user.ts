import type { User } from '../../auth/types/auth';

/** Usuario tal como lo devuelve GET /api/users. */
export interface UserRecord extends User {
  is_active: number;
  created_at: string;
}
