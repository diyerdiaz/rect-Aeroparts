import { useEffect } from 'react';
import { PLANE_PATH } from '../../../components/illustrations/planePath';

type Mode = 'takeoff' | 'landing';

const DURATION: Record<Mode, number> = { takeoff: 1500, landing: 1800 };

/**
 * Transición a pantalla completa: despegue al iniciar sesión y aterrizaje al cerrarla.
 * Llama a `onDone` cuando termina la animación.
 */
export function FlightOverlay({ mode, onDone }: { mode: Mode; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, DURATION[mode]);
    return () => clearTimeout(timer);
  }, [mode, onDone]);

  return (
    <div className={`flight flight--${mode}`} aria-hidden="true">
      {mode === 'landing' && <div className="flight__runway" />}
      <div className="flight__lane">
        <div className="flight__plane">
          <span className="flight__trail" />
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path transform="rotate(90 12 12)" d={PLANE_PATH} />
          </svg>
        </div>
      </div>
    </div>
  );
}
