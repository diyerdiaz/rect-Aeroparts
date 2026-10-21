import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError('');
    setLoading(true);
    try {
      await login({
        username: String(data.get('username')),
        password: String(data.get('password')),
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit} noValidate={false}>
      <div>
        <h1 className="title">Iniciar sesión</h1>
        <p className="muted">Accede al inventario de repuestos.</p>
      </div>
      <Input label="Usuario" name="username" autoComplete="username" minLength={3} required autoFocus />
      <Input
        label="Contraseña"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={6}
        required
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </Button>
    </form>
  );
}
