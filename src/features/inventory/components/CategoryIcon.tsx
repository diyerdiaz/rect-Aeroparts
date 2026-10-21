import type { ReactNode } from 'react';

type Kind = 'engine' | 'gear' | 'avionics' | 'hydraulic' | 'structure' | 'generic';

const BLADES = [0, 60, 120, 180, 240, 300];

const PATHS: Record<Kind, ReactNode> = {
  engine: (
    <>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="4" />
      {BLADES.map((deg) => (
        <path key={deg} d="M24 20c4-3 5-8 3-14" transform={`rotate(${deg} 24 24)`} />
      ))}
    </>
  ),
  gear: (
    <>
      <path d="M24 4v18M16 4h16M24 12l-8 8" />
      <circle cx="24" cy="32" r="10" />
      <circle cx="24" cy="32" r="3" />
    </>
  ),
  avionics: (
    <>
      <rect x="12" y="12" width="24" height="24" rx="3" />
      <rect x="18" y="18" width="12" height="12" rx="1" />
      <path d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6" />
    </>
  ),
  hydraulic: (
    <>
      <path d="M24 6s-12 13-12 21a12 12 0 0 0 24 0c0-8-12-21-12-21Z" />
      <path d="M18 28a6 6 0 0 0 6 6" />
    </>
  ),
  structure: (
    <>
      <path d="M4 36h40M8 14h32" />
      <path d="M8 14 4 36M40 14l4 22M8 14l8 22 8-22 8 22 8-22" />
    </>
  ),
  generic: (
    <>
      <path d="m24 6 16 9v18l-16 9-16-9V15l16-9Z" />
      <path d="m8 15 16 9 16-9M24 24v18" />
    </>
  ),
};

/** Las categorías vienen del API, así que el dibujo se elige por palabras clave del nombre. */
const RULES: [RegExp, Kind][] = [
  [/motor|turbin|engine|propul/i, 'engine'],
  [/tren|aterriza|rueda|llanta|freno|gear/i, 'gear'],
  [/avi[oó]nic|electr[oó]nic|instrument|radio|sensor/i, 'avionics'],
  [/hidr[aá]ul|combust|fluid|aceite|bomba/i, 'hydraulic'],
  [/estructur|fuselaj|ala|chapa|structure/i, 'structure'],
];

const kindOf = (name?: string): Kind => RULES.find(([re]) => name && re.test(name))?.[1] ?? 'generic';

export function CategoryIcon({ name, className = '' }: { name?: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[kindOf(name)]}
    </svg>
  );
}
