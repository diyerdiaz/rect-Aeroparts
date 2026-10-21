import type { Part } from '../types/part';
import { CategoryIcon } from './CategoryIcon';

/** Imagen del repuesto o, si no tiene, la ilustración de su categoría. */
export function PartMedia({ part, className = '' }: { part: Pick<Part, 'name' | 'category' | 'image'>; className?: string }) {
  return (
    <div className={`media ${className}`}>
      {part.image ? (
        <img src={part.image} alt={part.name} className="media__img" loading="lazy" />
      ) : (
        <CategoryIcon category={part.category} className="media__art" />
      )}
    </div>
  );
}
