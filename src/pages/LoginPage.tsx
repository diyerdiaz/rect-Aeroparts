import { Navigate } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { AuthLayout } from '../layouts/AuthLayout';

export default function LoginPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
