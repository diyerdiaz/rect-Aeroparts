/**
 * Otra aplicación que usa el mismo API guarda datos extra dentro de `description`
 * como JSON: {"desc","location","condition","sn","imgs"}. Aquí se interpreta ese
 * formato y se vuelve a escribir igual para no romper la compatibilidad.
 */
export interface ProductDetails {
  text: string;
  location: string;
  condition: string;
  serial: string;
  images: string[];
}

interface StoredMeta {
  desc?: string;
  location?: string;
  condition?: string;
  sn?: string;
  imgs?: unknown[];
  [key: string]: unknown;
}

function parseMeta(raw?: string | null): StoredMeta | null {
  if (!raw || !raw.trim().startsWith('{')) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (value && typeof value === 'object' && !Array.isArray(value)) return value as StoredMeta;
  } catch {
    /* no es JSON: texto normal */
  }
  return null;
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** La otra app guarda las fotos como base64 sin prefijo; se convierten en data URL. */
function toImageSrc(value: string): string {
  if (/^(data:|https?:|blob:|\/\/)/.test(value)) return value;
  const mime = value.startsWith('iVBOR') ? 'image/png' : value.startsWith('UklGR') ? 'image/webp' : 'image/jpeg';
  return `data:${mime};base64,${value}`;
}

export function parseDescription(raw?: string | null): ProductDetails {
  const meta = parseMeta(raw);
  if (!meta) return { text: raw ?? '', location: '', condition: '', serial: '', images: [] };
  return {
    text: str(meta.desc),
    location: str(meta.location),
    condition: str(meta.condition),
    serial: str(meta.sn),
    images: (meta.imgs ?? [])
      .filter((i): i is string => typeof i === 'string' && i.length > 0)
      .map(toImageSrc),
  };
}

/** Construye el valor de `description` conservando las claves que esta app no conoce. */
export function buildDescription(
  original: string | null | undefined,
  details: Omit<ProductDetails, 'images'>,
): string | null {
  const meta = parseMeta(original);
  const hasExtras = details.location || details.condition || details.serial;
  if (!meta && !hasExtras) return details.text || null;
  return JSON.stringify({
    ...(meta ?? { imgs: [] }),
    desc: details.text,
    location: details.location,
    condition: details.condition,
    sn: details.serial,
  });
}
