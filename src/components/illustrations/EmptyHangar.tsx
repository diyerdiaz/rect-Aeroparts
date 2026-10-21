/** Ilustración de estado vacío: hangar. */
export function EmptyHangar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 100" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 90h140M24 90V48a56 34 0 0 1 112 0v42" />
        <path d="M48 90V62h64v28M48 70h64M48 78h64" opacity="0.4" />
      </g>
    </svg>
  );
}
