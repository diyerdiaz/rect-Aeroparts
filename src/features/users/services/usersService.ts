import { http } from '../../../services/httpClient';
import type { UserRecord } from '../types/user';

export const getUsers = () => http<UserRecord[]>('/api/users?limit=500');
