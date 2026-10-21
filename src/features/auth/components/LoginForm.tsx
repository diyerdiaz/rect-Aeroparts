import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { prefersReducedMotion } from '../../../utils/motion';
import { useAuth } from '../hooks/useAuth';
import { InvalidCredentialsError } from '../services/authService';
import { CrashOverlay } from './CrashOverlay';
import { FlightOverlay } from './FlightOverlay';

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [takingOff, setTakingOff] = useState(false);
  const [crashing, setCrashing] = useState(false);
  const [shake, setShake] = useState(false);
  const pendingError = useRef('');

  const enterDashboard = useCallback(() => navigate('/dashboard', { replace: true }), [navigate]);

  const showError = useCallback((message: string) => {
    setError(message);
    setShake(true);
  }, []);

  // El mensaje de error aparece cuando termina el choque.
  const finishCrash = useCallback(() => {
    setCrashing(false);
    showError(pendingError.current);
  }, [showError]);

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
      if (prefersReducedMotion()) enterDashboard();
      else setTakingOff(true);
    } catch (err) {
      const message = (err as Error).message;
      if (err instanceof InvalidCredentialsError && !prefersReducedMotion()) {
        pendingError.current = message;
        setCrashing(true);
      } else {
        showError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  const busy = loading || takingOff || crashing;

  return (
    <form
      className={`stack ${shake ? 'shake' : ''}`}
      onSubmit={handleSubmit}
      onAnimationEnd={() => setShake(false)}
      noValidate={false}
    >
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
      <Button type="submit" disabled={busy}>
        {takingOff ? 'Despegando…' : loading ? 'Entrando…' : 'Entrar'}
      </Button>
      {takingOff && (
        <>
          <span className="sr-only" role="status">
            Sesión iniciada. Entrando al inventario.
          </span>
          <FlightOverlay mode="takeoff" onDone={enterDashboard} />
        </>
      )}
      {crashing && <CrashOverlay onDone={finishCrash} />}
    </form>
  );
}
