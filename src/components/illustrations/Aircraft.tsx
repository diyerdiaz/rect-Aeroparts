/** Ilustración de línea: avión visto desde arriba sobre un radar. Usa currentColor. */
export function Aircraft({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1" opacity="0.18">
        <circle cx="200" cy="200" r="190" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="140" strokeDasharray="2 6" />
        <circle cx="200" cy="200" r="90" strokeDasharray="2 6" />
        <path d="M200 0v400M0 200h400" strokeDasharray="2 6" />
      </g>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* fuselaje */}
        <path d="M200 40c10 2 14 22 14 50v240c0 15-6 30-14 32-8-2-14-17-14-32V90c0-28 4-48 14-50Z" />
        <path d="M193 70q7-5 14 0" />
        {/* alas */}
        <path d="M186 165 60 235v15l126-35M214 165l126 70v15l-126-35" />
        {/* motores */}
        <rect x="122" y="190" width="14" height="34" rx="7" />
        <rect x="264" y="190" width="14" height="34" rx="7" />
        {/* estabilizadores */}
        <path d="m188 312-53 30v12l53-16M212 312l53 30v12l-53-16" />
      </g>
      <circle cx="200" cy="200" r="3" fill="currentColor" />
    </svg>
  );
}
