import { memo } from 'react';
import { EditIcon, TrashIcon } from '../../../components/icons';
import { formatCurrency } from '../../../utils/format';
import type { Part } from '../types/part';
import { PartMedia } from './PartMedia';
import { StockBar } from './StockBar';

interface Props {
  part: Part;
  onView: (part: Part) => void;
  onEdit: (part: Part) => void;
  onDelete: (part: Part) => void;
}

export const PartCard = memo(function PartCard({ part, onView, onEdit, onDelete }: Props) {
  return (
    <article className="card part">
      <div className="part__top">
        <PartMedia part={part} className="part__media" />
        <span className="tag part__tag">{part.category}</span>
        <div className="part__actions">
          <button className="icon-btn icon-btn--solid" onClick={() => onEdit(part)} aria-label={`Editar ${part.name}`}>
            <EditIcon />
          </button>
          <button className="icon-btn icon-btn--solid" onClick={() => onDelete(part)} aria-label={`Eliminar ${part.name}`}>
            <TrashIcon />
          </button>
        </div>
      </div>
      <div className="part__body">
        {/* El botón se extiende sobre toda la tarjeta para abrir el detalle. */}
        <button className="part__name part__link" onClick={() => onView(part)}>
          {part.name}
        </button>
        <code className="muted">{part.partNumber}</code>
        <StockBar quantity={part.quantity} minStock={part.minStock} />
        <dl className="part__meta">
          <div>
            <dt>Ubicación</dt>
            <dd>{part.location}</dd>
          </div>
          <div>
            <dt>Precio unitario</dt>
            <dd>{formatCurrency(part.unitPrice)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
});
