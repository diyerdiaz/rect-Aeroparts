import { CategoryIcon } from './CategoryIcon';

interface Props {
  name: string;
  categoryName?: string;
  image?: string;
  className?: string;
}

/** Imagen del producto o, si no tiene, la ilustración de su categoría. */
export function PartMedia({ name, categoryName, image, className = '' }: Props) {
  return (
    <div className={`media ${className}`}>
      {image ? (
        <img src={image} alt={name} className="media__img" loading="lazy" />
      ) : (
        <CategoryIcon name={categoryName} className="media__art" />
      )}
    </div>
  );
}
