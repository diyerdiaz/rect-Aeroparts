import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';

export default function LoginPage() {
  const { user } = useAuth();
  // Solo se redirige si ya había sesión al abrir la página; tras iniciar sesión
  // el formulario navega al terminar la animación de despegue.
  const [hadSession] = useState(() => user !== null);
  if (hadSession) return <Navigate to="/dashboard" replace />;
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
