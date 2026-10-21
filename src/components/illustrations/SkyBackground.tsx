import type { CSSProperties } from 'react';

/** Rutas de vuelo: posición, ángulo, duración (s), desfase (s), tamaño (px) y opacidad. */
const FLIGHTS = [
  { top: '16%', angle: -8, duration: 38, delay: -6, size: 34, opacity: 0.35 },
  { top: '42%', angle: 184, duration: 56, delay: -24, size: 20, opacity: 0.2 },
  { top: '64%', angle: 5, duration: 48, delay: -34, size: 26, opacity: 0.26 },
  { top: '88%', angle: -14, duration: 32, delay: -14, size: 42, opacity: 0.3 },
];

/** Fondo animado decorativo: aviones con estela y un radar girando. */
export function SkyBackground() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__radar">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.4">
          <circle cx="100" cy="100" r="98" />
          <circle cx="100" cy="100" r="70" strokeDasharray="1 3" />
          <circle cx="100" cy="100" r="42" strokeDasharray="1 3" />
          <path d="M100 2v196M2 100h196" strokeDasharray="1 3" />
        </svg>
        <span className="sky__sweep" />
      </div>

      {FLIGHTS.map((f, i) => (
        <div key={i} className="sky__lane" style={{ top: f.top, transform: `rotate(${f.angle}deg)` }}>
          <div
            className="sky__plane"
            style={
              {
                '--size': `${f.size}px`,
                animationDuration: `${f.duration}s`,
                animationDelay: `${f.delay}s`,
                opacity: f.opacity,
              } as CSSProperties
            }
          >
            <span className="sky__trail" />
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                transform="rotate(90 12 12)"
                d="M12 2.5c1 .3 1.4 2 1.4 4v4.2l7.6 4.3v1.6l-7.6-2.2v4.1l2.2 1.6v1.4L12 20.6l-3.6.9v-1.4l2.2-1.6v-4.1L3 16.6V15l7.6-4.3V6.5c0-2 .4-3.7 1.4-4Z"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
