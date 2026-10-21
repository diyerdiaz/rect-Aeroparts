import { EmptyHangar } from '../../../components/illustrations/EmptyHangar';
import type { Product } from '../types/product';
import { PartCard } from './PartCard';

interface Props {
  products: Product[];
  categoryNames: Map<number, string>;
  supplierNames: Map<number, string>;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function PartsGrid({ products, categoryNames, supplierNames, ...handlers }: Props) {
  if (products.length === 0)
    return (
      <div className="empty">
        <EmptyHangar className="empty__art" />
        <p>No hay productos</p>
        <span className="muted">Prueba otra búsqueda o añade uno nuevo.</span>
      </div>
    );
  return (
    <div className="grid">
      {products.map((p) => (
        <PartCard
          key={p.id}
          product={p}
          categoryName={p.category_id != null ? categoryNames.get(p.category_id) : undefined}
          supplierName={p.supplier_id != null ? supplierNames.get(p.supplier_id) : undefined}
          {...handlers}
        />
      ))}
    </div>
  );
}
