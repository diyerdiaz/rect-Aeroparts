import { EmptyHangar } from '../../../components/illustrations/EmptyHangar';
import type { Part } from '../types/part';
import { PartCard } from './PartCard';

interface Props {
  parts: Part[];
  onView: (part: Part) => void;
  onEdit: (part: Part) => void;
  onDelete: (part: Part) => void;
}

export function PartsGrid({ parts, ...handlers }: Props) {
  if (parts.length === 0)
    return (
      <div className="empty">
        <EmptyHangar className="empty__art" />
        <p>No hay repuestos</p>
        <span className="muted">Prueba otra búsqueda o añade uno nuevo.</span>
      </div>
    );
  return (
    <div className="grid">
      {parts.map((part) => (
        <PartCard key={part.id} part={part} {...handlers} />
      ))}
    </div>
  );
}
