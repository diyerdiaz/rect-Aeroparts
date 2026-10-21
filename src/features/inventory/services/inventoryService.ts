import { http } from '../../../services/httpClient';
import type { Category, Product, ProductInput, Supplier } from '../types/product';
import { buildDescription, parseDescription } from '../utils/description';
import { getImage, setImage } from './imageStore';

type ApiProduct = Omit<Product, 'details' | 'image'>;

/** Añade los datos interpretados de la descripción y la imagen (local o de la otra app). */
function hydrate(p: ApiProduct, localImage = getImage(p.id)): Product {
  const details = parseDescription(p.description);
  return { ...p, details, image: localImage ?? details.images[0] };
}

/** Convierte los datos del formulario al cuerpo que espera el API. */
function toPayload(
  { image: _image, stock_quantity: _stock, location, condition, serial, description, ...rest }: ProductInput,
  originalDescription?: string | null,
) {
  return {
    ...rest,
    description: buildDescription(originalDescription, { text: description ?? '', location, condition, serial }),
  };
}

export async function getProducts(): Promise<Product[]> {
  const list = await http<ApiProduct[]>('/api/products?limit=500');
  return list.filter((p) => p.is_active !== 0).map((p) => hydrate(p));
}

export const getCategories = () => http<Category[]>('/api/categories?limit=500');
export const getSuppliers = () => http<Supplier[]>('/api/suppliers?limit=500');

export async function createProduct(input: ProductInput): Promise<Product> {
  const body = { ...toPayload(input), stock_quantity: input.stock_quantity };
  const created = await http<ApiProduct>('/api/products', { method: 'POST', body: JSON.stringify(body) });
  if (input.image) setImage(created.id, input.image);
  return hydrate(created, input.image);
}

interface MovementResponse {
  new_stock: number;
}

/**
 * El API no permite cambiar el stock al editar un producto: la diferencia
 * se registra como un movimiento de entrada o salida.
 */
export async function updateProduct(current: Product, input: ProductInput): Promise<Product> {
  const { image, stock_quantity } = input;
  const body = toPayload(input, current.description);
  let updated = await http<ApiProduct>(`/api/products/${current.id}`, { method: 'PUT', body: JSON.stringify(body) });

  const diff = stock_quantity - current.stock_quantity;
  if (diff !== 0) {
    const movement = await http<MovementResponse>('/api/inventory/movements', {
      method: 'POST',
      body: JSON.stringify({
        product_id: current.id,
        movement_type: diff > 0 ? 'entry' : 'exit',
        quantity: Math.abs(diff),
        reason: 'Ajuste desde el panel de inventario',
      }),
    });
    updated = { ...updated, stock_quantity: movement.new_stock };
  }

  // Solo se guarda localmente si es distinta de la que ya trae la otra app.
  const remoteImage = parseDescription(updated.description).images[0];
  setImage(current.id, image !== remoteImage ? image : undefined);
  return hydrate(updated, image);
}

export async function deleteProduct(id: number): Promise<void> {
  await http<void>(`/api/products/${id}`, { method: 'DELETE' });
  setImage(id, undefined);
}
