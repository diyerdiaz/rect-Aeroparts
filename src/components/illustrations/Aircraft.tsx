/** Ilustración animada: avión visto desde arriba sobre un radar. Usa currentColor. */
export function Aircraft({ className = '' }: { className?: string }) {
  return (
    <svg className={`aircraft ${className}`} viewBox="0 0 400 400" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="sweep-fade" gradientUnits="userSpaceOnUse" x1="200" y1="10" x2="322" y2="55">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* radar */}
      <g stroke="currentColor" strokeWidth="1" opacity="0.18">
        <circle cx="200" cy="200" r="190" strokeDasharray="2 6" />
        <g className="aircraft__rings">
          <circle cx="200" cy="200" r="140" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="90" strokeDasharray="2 6" />
        </g>
        <path d="M200 0v400M0 200h400" strokeDasharray="2 6" />
      </g>

      {/* barrido: el borde brillante va adelante en el sentido del giro */}
      <g className="aircraft__sweep">
        <path d="M200 200 200 10A190 190 0 0 1 322.1 54.5Z" fill="url(#sweep-fade)" />
        <path d="M200 200 322.1 54.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>

      {/* onda que sale del centro */}
      <circle className="aircraft__pulse" cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="1" />

      {/* blancos detectados */}
      <g fill="currentColor">
        <circle className="aircraft__blip" cx="300" cy="120" r="3" />
        <circle className="aircraft__blip" cx="95" cy="290" r="2.5" style={{ animationDelay: '1.4s' }} />
        <circle className="aircraft__blip" cx="320" cy="300" r="2" style={{ animationDelay: '2.6s' }} />
        <circle className="aircraft__blip" cx="80" cy="110" r="2" style={{ animationDelay: '3.5s' }} />
      </g>

      {/* avión */}
      <g className="aircraft__plane">
        {/* estelas de los motores */}
        <g className="aircraft__trails" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="6 10">
          <path d="M129 228v120" />
          <path d="M271 228v120" />
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
        <circle className="aircraft__beacon" cx="200" cy="200" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}
