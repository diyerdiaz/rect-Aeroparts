/**
 * Convierte un archivo de imagen en un data URL JPEG reducido,
 * para que pese poco al guardarse junto al repuesto.
 */
export async function fileToResizedDataUrl(file: File, maxSize = 800, quality = 0.82): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo seleccionado no es una imagen');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; // fondo para PNG transparentes
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}
