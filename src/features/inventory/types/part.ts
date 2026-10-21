export const CATEGORIES = [
  'Motor',
  'Tren de aterrizaje',
  'Aviónica',
  'Hidráulica',
  'Estructura',
] as const;

export type PartCategory = (typeof CATEGORIES)[number];

export interface Part {
  id: string;
  partNumber: string;
  name: string;
  category: PartCategory;
  location: string;
  quantity: number;
  minStock: number;
  unitPrice: number;
  /** Imagen como data URL (o URL remota cuando exista backend). */
  image?: string;
}

export type NewPart = Omit<Part, 'id'>;
