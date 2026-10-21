import { Button } from '../../../components/Button';
import { EditIcon, TrashIcon } from '../../../components/icons';
import { Modal } from '../../../components/Modal';
import { formatCurrency, formatNumber } from '../../../utils/format';
import type { Part } from '../types/part';
import { PartMedia } from './PartMedia';
import { StockBar } from './StockBar';

interface Props {
  part: Part | null;
  onClose: () => void;
  onEdit: (part: Part) => void;
  onDelete: (part: Part) => void;
}

export function PartDetailModal({ part, onClose, onEdit, onDelete }: Props) {
  return (
    <Modal open={part !== null} title="Detalle del repuesto" onClose={onClose} size="lg">
      {part && (
        <div className="detail">
          <PartMedia part={part} className="detail__media" />
          <div className="stack">
            <div>
              <span className="tag">{part.category}</span>
              <h3 className="detail__name">{part.name}</h3>
              <code className="muted">{part.partNumber}</code>
            </div>
            <StockBar quantity={part.quantity} minStock={part.minStock} />
            <dl className="detail__grid">
              <div>
                <dt>Ubicación</dt>
                <dd>{part.location}</dd>
              </div>
              <div>
                <dt>Cantidad</dt>
                <dd>{formatNumber(part.quantity)}</dd>
              </div>
              <div>
                <dt>Stock mínimo</dt>
                <dd>{formatNumber(part.minStock)}</dd>
              </div>
              <div>
                <dt>Precio unitario</dt>
                <dd>{formatCurrency(part.unitPrice)}</dd>
              </div>
              <div>
                <dt>Valor en almacén</dt>
                <dd>{formatCurrency(part.quantity * part.unitPrice)}</dd>
              </div>
            </dl>
            <div className="row detail__actions">
              <Button variant="ghost" onClick={() => onDelete(part)}>
                <TrashIcon />
                Eliminar
              </Button>
              <Button onClick={() => onEdit(part)}>
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
