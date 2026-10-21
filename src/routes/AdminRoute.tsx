import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { isAdmin } from '../features/auth/types/auth';

/** Solo administradores; el resto vuelve al inventario. El backend también debe validarlo. */
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin(user) ? <>{children}</> : <Navigate to="/dashboard" replace />;
}
