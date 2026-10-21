import { Button } from '../../../components/Button';
import { EditIcon, TrashIcon } from '../../../components/icons';
import { Modal } from '../../../components/Modal';
import { formatCurrency, formatNumber } from '../../../utils/format';
import type { Product } from '../types/product';
import { PartMedia } from './PartMedia';
import { StockBar } from './StockBar';

interface Props {
  product: Product | null;
  categoryNames: Map<number, string>;
  supplierNames: Map<number, string>;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function PartDetailModal({ product, categoryNames, supplierNames, onClose, onEdit, onDelete }: Props) {
  const category = product?.category_id != null ? categoryNames.get(product.category_id) : undefined;
  const supplier = product?.supplier_id != null ? supplierNames.get(product.supplier_id) : undefined;

  return (
    <Modal open={product !== null} title="Detalle del producto" onClose={onClose} size="lg">
      {product && (
        <div className="detail">
          <PartMedia name={product.name} categoryName={category} image={product.image} className="detail__media" />
          <div className="stack">
            <div>
              <span className="tag">{category ?? 'Sin categoría'}</span>
              <h3 className="detail__name">{product.name}</h3>
              <code className="muted">{product.sku}</code>
              {product.details.text && <p className="muted detail__desc">{product.details.text}</p>}
            </div>
            <StockBar quantity={product.stock_quantity} minStock={product.min_stock} unit={product.unit} />
            <dl className="detail__grid">
              <div>
                <dt>Ubicación</dt>
                <dd>{product.details.location || '—'}</dd>
              </div>
              <div>
                <dt>Condición</dt>
                <dd>{product.details.condition || '—'}</dd>
              </div>
              <div>
                <dt>Número de serie</dt>
                <dd>{product.details.serial || '—'}</dd>
              </div>
              <div>
                <dt>Proveedor</dt>
                <dd>{supplier ?? '—'}</dd>
              </div>
              <div>
                <dt>Unidad</dt>
                <dd>{product.unit}</dd>
              </div>
              <div>
                <dt>Precio</dt>
                <dd>{formatCurrency(product.price)}</dd>
              </div>
              <div>
                <dt>Costo</dt>
                <dd>{formatCurrency(product.cost)}</dd>
              </div>
              <div>
                <dt>Stock mínimo</dt>
                <dd>{formatNumber(product.min_stock)}</dd>
              </div>
              <div>
                <dt>Valor en almacén</dt>
                <dd>{formatCurrency(product.stock_quantity * product.price)}</dd>
              </div>
            </dl>
            <div className="row detail__actions">
              <Button variant="ghost" onClick={() => onDelete(product)}>
                <TrashIcon />
                Eliminar
              </Button>
              <Button onClick={() => onEdit(product)}>
                <EditIcon />
                Editar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
