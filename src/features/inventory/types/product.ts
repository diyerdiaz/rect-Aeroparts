import type { ProductDetails } from '../utils/description';

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Supplier {
  id: number;
  name: string;
}

/** Producto tal como lo devuelve el API, más la imagen guardada localmente. */
export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  category_id?: number | null;
  supplier_id?: number | null;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock: number;
  unit: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  /** Datos interpretados de `description` (texto, ubicación, condición, serie). */
  details: ProductDetails;
  image?: string;
}

/** Datos que maneja el formulario de crear/editar. */
export interface ProductInput {
  name: string;
  sku: string;
  description: string | null;
  location: string;
  condition: string;
  serial: string;
  category_id: number | null;
  supplier_id: number | null;
  price: number;
  cost: number;
  stock_quantity: number;
  min_stock: number;
  unit: string;
  image?: string;
}

export const isLowStock = (p: Pick<Product, 'stock_quantity' | 'min_stock'>) => p.stock_quantity < p.min_stock;
