import { delay } from '../../../services/httpClient';
import type { NewPart, Part } from '../types/part';

// Datos simulados persistidos en localStorage. TODO: reemplazar por llamadas a http('/parts').
const STORAGE_KEY = 'aeroparts.parts';

const SEED: Part[] = [
  { id: '1', partNumber: 'CFM56-7B-001', name: 'Álabe de turbina', category: 'Motor', location: 'A-01', quantity: 24, minStock: 10, unitPrice: 4200 },
  { id: '2', partNumber: 'LG-737-114', name: 'Amortiguador principal', category: 'Tren de aterrizaje', location: 'B-03', quantity: 3, minStock: 4, unitPrice: 18500 },
  { id: '3', partNumber: 'AV-ADIRU-22', name: 'Unidad ADIRU', category: 'Aviónica', location: 'C-07', quantity: 6, minStock: 2, unitPrice: 96000 },
  { id: '4', partNumber: 'HY-PMP-310', name: 'Bomba hidráulica', category: 'Hidráulica', location: 'D-02', quantity: 1, minStock: 3, unitPrice: 27300 },
  { id: '5', partNumber: 'ST-RIB-0457', name: 'Costilla de ala', category: 'Estructura', location: 'E-11', quantity: 12, minStock: 5, unitPrice: 3100 },
];

function load(): Part[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Part[];
  } catch {
    /* almacenamiento no disponible: usar datos de ejemplo */
  }
  return SEED;
}

let parts: Part[] = load();

/** Guarda primero y solo entonces actualiza la memoria, para no quedar desincronizados. */
function commit(next: Part[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    throw new Error('No hay espacio suficiente para guardar. Prueba con una imagen más pequeña.');
  }
  parts = next;
}

export async function getParts(): Promise<Part[]> {
  await delay();
  return [...parts];
}

export async function createPart(data: NewPart): Promise<Part> {
  await delay();
  const part: Part = { ...data, id: crypto.randomUUID() };
  commit([part, ...parts]);
  return part;
}

export async function updatePart(id: string, data: NewPart): Promise<Part> {
  await delay();
  const part: Part = { ...data, id };
  commit(parts.map((p) => (p.id === id ? part : p)));
  return part;
}

export async function deletePart(id: string): Promise<void> {
  await delay(150);
  commit(parts.filter((p) => p.id !== id));
}
