import { PLANE_PATH } from './illustrations/planePath';

export function Logo() {
  return (
    <span className="logo">
      <span className="logo__mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d={PLANE_PATH} />
        </svg>
      </span>
      Aeroparts
    </span>
  );
}
