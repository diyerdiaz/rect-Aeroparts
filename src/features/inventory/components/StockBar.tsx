export function StockBar({ quantity, minStock, unit }: { quantity: number; minStock: number; unit?: string }) {
  const low = quantity < minStock;
  const level = minStock > 0 ? Math.min(100, (quantity / (minStock * 2)) * 100) : quantity > 0 ? 100 : 0;
  return (
    <div className="stock">
      <div className="stock__label">
        <span className="muted">Stock</span>
        <span className={low ? 'is-alert' : ''}>
          {quantity} {unit && <span className="muted">{unit}</span>}{' '}
          <span className="muted">/ mín. {minStock}</span>
        </span>
      </div>
      <div className="stock__bar" role="presentation">
        <span className={low ? 'is-low' : ''} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
