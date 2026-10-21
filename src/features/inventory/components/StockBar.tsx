export function StockBar({ quantity, minStock }: { quantity: number; minStock: number }) {
  const low = quantity < minStock;
  const level = minStock > 0 ? Math.min(100, (quantity / (minStock * 2)) * 100) : 100;
  return (
    <div className="stock">
      <div className="stock__label">
        <span className="muted">Stock</span>
        <span className={low ? 'is-alert' : ''}>
          {quantity} <span className="muted">/ mín. {minStock}</span>
        </span>
      </div>
      <div className="stock__bar" role="presentation">
        <span className={low ? 'is-low' : ''} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
