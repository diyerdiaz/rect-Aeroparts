import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AlertIcon, BoxIcon, LayersIcon, PlusIcon, SearchIcon, ValueIcon } from '../components/icons';
import { MetricCard } from '../features/inventory/components/MetricCard';
import { PartDetailModal } from '../features/inventory/components/PartDetailModal';
import { PartFormModal } from '../features/inventory/components/PartFormModal';
import { PartsGrid } from '../features/inventory/components/PartsGrid';
import { useInventory } from '../features/inventory/hooks/useInventory';
import type { Product, ProductInput } from '../features/inventory/types/product';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { formatCurrency, formatNumber } from '../utils/format';

type FormState = { open: false } | { open: true; product: Product | null };

export default function DashboardPage() {
  const inv = useInventory();
  const { products, categoryNames, supplierNames } = inv;
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const [viewing, setViewing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>({ open: false });
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [
        p.name,
        p.sku,
        p.details.text,
        p.details.location,
        p.details.serial,
        p.category_id != null ? (categoryNames.get(p.category_id) ?? '') : '',
        p.supplier_id != null ? (supplierNames.get(p.supplier_id) ?? '') : '',
      ].some((v) => v.toLowerCase().includes(q)),
    );
  }, [products, categoryNames, supplierNames, deferredQuery]);

  const openCreate = () => setForm({ open: true, product: null });
  const openEdit = useCallback((product: Product) => {
    setViewing(null);
    setForm({ open: true, product });
  }, []);
  const openDelete = useCallback((product: Product) => {
    setViewing(null);
    setDeleting(product);
  }, []);

  const editing = form.open ? form.product : null;
  async function handleSubmit(data: ProductInput) {
    if (editing) await inv.updateProduct(editing, data);
    else await inv.addProduct(data);
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="title">Inventario</h1>
          <p className="muted">Repuestos aeronáuticos en almacén</p>
        </div>
        <Button onClick={openCreate} disabled={inv.loading || !!inv.error}>
          <PlusIcon />
          Añadir producto
        </Button>
      </div>

      <section className="metrics" aria-label="Resumen">
        <MetricCard label="Productos" value={formatNumber(inv.metrics.references)} icon={<LayersIcon />} />
        <MetricCard label="Unidades" value={formatNumber(inv.metrics.units)} icon={<BoxIcon />} />
        <MetricCard
          label="Stock bajo"
          value={formatNumber(inv.metrics.lowStock)}
          icon={<AlertIcon />}
          alert={inv.metrics.lowStock > 0}
        />
        <MetricCard label="Valor total" value={formatCurrency(inv.metrics.value)} icon={<ValueIcon />} />
      </section>

      <label className="search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Buscar por nombre, SKU, categoría o proveedor"
          aria-label="Buscar productos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {inv.error ? (
        <div className="card notice" role="alert">
          <p className="error">{inv.error}</p>
          <Button variant="ghost" onClick={inv.reload}>
            Reintentar
          </Button>
        </div>
      ) : inv.loading ? (
        <p className="muted loading">Cargando…</p>
      ) : (
        <PartsGrid
          products={filtered}
          categoryNames={categoryNames}
          supplierNames={supplierNames}
          onView={setViewing}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      <PartDetailModal
        product={viewing}
        categoryNames={categoryNames}
        supplierNames={supplierNames}
        onClose={() => setViewing(null)}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <PartFormModal
        open={form.open}
        product={editing}
        categories={inv.categories}
        suppliers={inv.suppliers}
        onClose={() => setForm({ open: false })}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar “${deleting?.name ?? ''}”? Esta acción no se puede deshacer.`}
        onConfirm={() => (deleting ? inv.removeProduct(deleting.id) : undefined)}
        onClose={() => setDeleting(null)}
      />
    </DashboardLayout>
  );
}
