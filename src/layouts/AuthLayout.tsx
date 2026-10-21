import type { ReactNode } from 'react';
import { Logo } from '../components/Logo';
import { CheckIcon } from '../components/icons';
import { Aircraft } from '../components/illustrations/Aircraft';

const FEATURES = [
  'Control de stock en tiempo real',
  'Alertas de stock mínimo',
  'Trazabilidad por número de parte',
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <Logo />
        <Aircraft className="auth__art" />
        <div>
          <p className="auth__lead">Inventario de repuestos aeronáuticos.</p>
          <ul className="auth__features">
            {FEATURES.map((f) => (
              <li key={f}>
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="auth__main">{children}</main>
    </div>
  );
}
