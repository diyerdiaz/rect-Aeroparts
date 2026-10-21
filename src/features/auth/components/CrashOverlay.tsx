import { useEffect, type CSSProperties } from 'react';
import { PLANE_PATH } from '../../../components/illustrations/planePath';

const DURATION = 2500;
const DEBRIS = ['#e7e5e4', '#a8a29e', '#78716c', '#57534e'];

/** Escombros repartidos en círculo (valores fijos: la explosión siempre se ve igual). */
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  angle: i * 22.5 + (i % 3) * 6,
  distance: 70 + ((i * 37) % 90),
  size: 3 + ((i * 5) % 6),
  color: DEBRIS[i % DEBRIS.length],
}));

/** Bocanadas de humo: posición inicial, deriva hacia arriba, tamaño y retraso. */
const SMOKE = [
  { x: 0, y: 0, dx: 0, dy: -90, size: 90, delay: 0.55 },
  { x: -30, y: -8, dx: -40, dy: -70, size: 80, delay: 0.6 },
  { x: 32, y: -12, dx: 36, dy: -80, size: 84, delay: 0.62 },
  { x: -12, y: 18, dx: -20, dy: -60, size: 70, delay: 0.68 },
  { x: 20, y: 20, dx: 24, dy: -55, size: 66, delay: 0.72 },
  { x: -46, y: 10, dx: -60, dy: -40, size: 60, delay: 0.78 },
  { x: 48, y: 6, dx: 58, dy: -46, size: 58, delay: 0.82 },
  { x: 0, y: -30, dx: 6, dy: -120, size: 74, delay: 0.88 },
  { x: -18, y: -26, dx: -24, dy: -110, size: 62, delay: 0.95 },
  { x: 22, y: -28, dx: 30, dy: -105, size: 60, delay: 1.0 },
];

const Plane = ({ side }: { side: 'left' | 'right' }) => (
  <div className={`crash__plane crash__plane--${side}`}>
    <span className="crash__trail" />
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path transform={`rotate(${side === 'left' ? 90 : -90} 12 12)`} d={PLANE_PATH} />
    </svg>
  </div>
);

/**
 * Dos aviones chocan en diagonal en el centro de la pantalla y dejan una nube de humo gris
 * que se disipa. Se muestra cuando las credenciales son incorrectas.
 */
export function CrashOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, DURATION);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="crash" aria-hidden="true">
      <div className="crash__lane">
        <Plane side="left" />
        <Plane side="right" />
      </div>
      <div className="crash__blast">
        <span className="crash__ring" />
        <span className="crash__flash" />
        {SPARKS.map((s, i) => (
          <span
            key={`spark-${i}`}
            className="crash__spark"
            style={{ '--a': `${s.angle}deg`, '--d': `${s.distance}px`, '--s': `${s.size}px`, '--c': s.color } as CSSProperties}
          />
        ))}
        {SMOKE.map((s, i) => (
          <span
            key={`smoke-${i}`}
            className="crash__smoke"
            style={
              {
                '--x': `${s.x}px`,
                '--y': `${s.y}px`,
                '--dx': `${s.dx}px`,
                '--dy': `${s.dy}px`,
                '--size': `${s.size}px`,
                animationDelay: `${s.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
