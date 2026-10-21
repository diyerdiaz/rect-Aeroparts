import { memo } from 'react';
import { EditIcon, TrashIcon } from '../../../components/icons';
import { formatCurrency } from '../../../utils/format';
import type { Product } from '../types/product';
import { PartMedia } from './PartMedia';
import { StockBar } from './StockBar';

interface Props {
  product: Product;
  categoryName?: string;
  supplierName?: string;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const PartCard = memo(function PartCard({ product, categoryName, supplierName, onView, onEdit, onDelete }: Props) {
  return (
    <article className="card part">
      <div className="part__top">
        <PartMedia name={product.name} categoryName={categoryName} image={product.image} className="part__media" />
        <span className="tag part__tag">{categoryName ?? 'Sin categoría'}</span>
        <div className="part__actions">
          <button className="icon-btn icon-btn--solid" onClick={() => onEdit(product)} aria-label={`Editar ${product.name}`}>
            <EditIcon />
          </button>
          <button className="icon-btn icon-btn--solid" onClick={() => onDelete(product)} aria-label={`Eliminar ${product.name}`}>
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="part__body">
        {/* El botón se extiende sobre toda la tarjeta para abrir el detalle. */}
        <button className="part__link" onClick={() => onView(product)}>
          {product.name}
        </button>
        <code className="muted">{product.sku}</code>
        <StockBar quantity={product.stock_quantity} minStock={product.min_stock} unit={product.unit} />
        <dl className="part__meta">
          <div>
            <dt>{product.details.location ? 'Ubicación' : 'Proveedor'}</dt>
            <dd>{product.details.location || supplierName || '—'}</dd>
          </div>
          <div>
            <dt>Precio</dt>
            <dd>{formatCurrency(product.price)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
});
