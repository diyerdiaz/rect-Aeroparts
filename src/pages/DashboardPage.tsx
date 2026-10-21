import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AlertIcon, BoxIcon, LayersIcon, PlusIcon, SearchIcon, ValueIcon } from '../components/icons';
import { MetricCard } from '../features/inventory/components/MetricCard';
import { PartDetailModal } from '../features/inventory/components/PartDetailModal';
import { PartFormModal } from '../features/inventory/components/PartFormModal';
import { PartsGrid } from '../features/inventory/components/PartsGrid';
import { useInventory } from '../features/inventory/hooks/useInventory';
import type { NewPart, Part } from '../features/inventory/types/part';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { formatCurrency, formatNumber } from '../utils/format';

type FormState = { open: false } | { open: true; part: Part | null };

export default function DashboardPage() {
  const { parts, loading, error, metrics, addPart, updatePart, removePart } = useInventory();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const [viewing, setViewing] = useState<Part | null>(null);
  const [form, setForm] = useState<FormState>({ open: false });
  const [deleting, setDeleting] = useState<Part | null>(null);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter((p) =>
      [p.name, p.partNumber, p.category, p.location].some((v) => v.toLowerCase().includes(q)),
    );
  }, [parts, deferredQuery]);

  const openCreate = () => setForm({ open: true, part: null });
  const openEdit = useCallback((part: Part) => {
    setViewing(null);
    setForm({ open: true, part });
  }, []);
  const openDelete = useCallback((part: Part) => {
    setViewing(null);
    setDeleting(part);
  }, []);

  const editingPart = form.open ? form.part : null;
  async function handleSubmit(data: NewPart) {
    if (editingPart) await updatePart(editingPart.id, data);
    else await addPart(data);
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="title">Inventario</h1>
          <p className="muted">Repuestos aeronáuticos en almacén</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Añadir repuesto
        </Button>
      </div>

      <section className="metrics" aria-label="Resumen">
        <MetricCard label="Referencias" value={formatNumber(metrics.references)} icon={<LayersIcon />} />
        <MetricCard label="Unidades" value={formatNumber(metrics.units)} icon={<BoxIcon />} />
        <MetricCard
          label="Stock bajo"
          value={formatNumber(metrics.lowStock)}
          icon={<AlertIcon />}
          alert={metrics.lowStock > 0}
        />
        <MetricCard label="Valor total" value={formatCurrency(metrics.value)} icon={<ValueIcon />} />
      </section>

      <label className="search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Buscar por nombre, número de parte, categoría o ubicación"
          aria-label="Buscar repuestos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted loading">Cargando…</p>
      ) : (
        <PartsGrid parts={filtered} onView={setViewing} onEdit={openEdit} onDelete={openDelete} />
      )}

      <PartDetailModal part={viewing} onClose={() => setViewing(null)} onEdit={openEdit} onDelete={openDelete} />

      <PartFormModal
        open={form.open}
        part={editingPart}
        onClose={() => setForm({ open: false })}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar repuesto"
        message={`¿Seguro que quieres eliminar “${deleting?.name ?? ''}”? Esta acción no se puede deshacer.`}
        onConfirm={() => (deleting ? removePart(deleting.id) : undefined)}
        onClose={() => setDeleting(null)}
      />
    </DashboardLayout>
  );
}
