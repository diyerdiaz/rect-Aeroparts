import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import type { Category, Product, ProductInput, Supplier } from '../types/product';
import { ImageInput } from './ImageInput';

interface Props {
  open: boolean;
  /** Si se pasa, el formulario edita ese producto; si no, crea uno nuevo. */
  product?: Product | null;
  categories: Category[];
  suppliers: Supplier[];
  onClose: () => void;
  onSubmit: (data: ProductInput) => Promise<void>;
}

export function PartFormModal({ open, product, ...props }: Props) {
  return (
    <Modal open={open} title={product ? 'Editar producto' : 'Nuevo producto'} onClose={props.onClose}>
      <PartForm product={product} {...props} />
    </Modal>
  );
}

const CONDITIONS = ['Disponible', 'En reparación', 'En inspección', 'Reservado', 'Dañado'];

const optionalId = (v: FormDataEntryValue | null) => (v ? Number(v) : null);

function PartForm({ product, categories, suppliers, onClose, onSubmit }: Omit<Props, 'open'>) {
  const [image, setImage] = useState(product?.image);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        name: String(d.get('name')).trim(),
        sku: String(d.get('sku')).trim(),
        description: String(d.get('description')).trim() || null,
        location: String(d.get('location')).trim(),
        condition: String(d.get('condition')).trim(),
        serial: String(d.get('serial')).trim(),
        category_id: optionalId(d.get('category_id')),
        supplier_id: optionalId(d.get('supplier_id')),
        price: Number(d.get('price')),
        cost: Number(d.get('cost')),
        stock_quantity: Number(d.get('stock_quantity')),
        min_stock: Number(d.get('min_stock')),
        unit: String(d.get('unit')).trim() || 'unidad',
        image,
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <ImageInput value={image} onChange={setImage} />
      <Input label="Nombre" name="name" defaultValue={product?.name} maxLength={150} required />
      <div className="row">
        <Input label="SKU / Número de parte" name="sku" defaultValue={product?.sku} maxLength={50} required />
        <Input label="Unidad" name="unit" defaultValue={product?.unit ?? 'unidad'} />
      </div>
      <div className="row">
        <label className="field">
          <span className="field__label">Categoría</span>
          <select name="category_id" className="field__input" defaultValue={product?.category_id ?? ''}>
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Proveedor</span>
          <select name="supplier_id" className="field__input" defaultValue={product?.supplier_id ?? ''}>
            <option value="">Sin proveedor</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="row">
        <Input label="Precio (USD)" name="price" type="number" min={0} step="0.01" defaultValue={product?.price ?? 0} required />
        <Input label="Costo (USD)" name="cost" type="number" min={0} step="0.01" defaultValue={product?.cost ?? 0} required />
      </div>
      <div className="row">
        <Input label="Stock" name="stock_quantity" type="number" min={0} defaultValue={product?.stock_quantity ?? 0} required />
        <Input label="Stock mínimo" name="min_stock" type="number" min={0} defaultValue={product?.min_stock ?? 0} required />
      </div>
      <div className="row">
        <Input label="Ubicación" name="location" defaultValue={product?.details.location} />
        <Input label="Número de serie" name="serial" defaultValue={product?.details.serial} />
      </div>
      <Input label="Condición" name="condition" list="conditions" defaultValue={product?.details.condition ?? 'Disponible'} />
      <datalist id="conditions">
        {CONDITIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {product && <p className="muted hint">Si cambias el stock se registrará un movimiento de entrada o salida.</p>}
      <label className="field">
        <span className="field__label">Descripción</span>
        <textarea name="description" className="field__input" rows={3} defaultValue={product?.details.text ?? ''} />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="row row--end modal__actions">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : product ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}
