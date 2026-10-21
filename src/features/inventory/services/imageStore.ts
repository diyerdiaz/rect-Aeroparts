/**
 * El API no guarda imágenes, así que se conservan en este navegador
 * asociadas al id del producto.
 */
const STORAGE_KEY = 'aeroparts.images';

function readAll(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

export function getImage(productId: number): string | undefined {
  return readAll()[productId];
}

export function setImage(productId: number, image: string | undefined) {
  const all = readAll();
  if (image) all[productId] = image;
  else delete all[productId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    throw new Error('No hay espacio en el navegador para guardar la imagen. Prueba con una más pequeña.');
  }
}
