import { useState, type FormEvent } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Modal } from '../../../components/Modal';
import { CATEGORIES, type NewPart, type Part, type PartCategory } from '../types/part';
import { ImageInput } from './ImageInput';

interface Props {
  open: boolean;
  /** Si se pasa, el formulario edita ese repuesto; si no, crea uno nuevo. */
  part?: Part | null;
  onClose: () => void;
  onSubmit: (data: NewPart) => Promise<void>;
}

export function PartFormModal({ open, part, onClose, onSubmit }: Props) {
  return (
    <Modal open={open} title={part ? 'Editar repuesto' : 'Nuevo repuesto'} onClose={onClose}>
      <PartForm part={part} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}

function PartForm({ part, onClose, onSubmit }: Omit<Props, 'open'>) {
  const [image, setImage] = useState(part?.image);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        partNumber: String(d.get('partNumber')).trim(),
        name: String(d.get('name')).trim(),
        category: d.get('category') as PartCategory,
        location: String(d.get('location')).trim(),
        quantity: Number(d.get('quantity')),
        minStock: Number(d.get('minStock')),
        unitPrice: Number(d.get('unitPrice')),
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
      <Input label="Nombre" name="name" defaultValue={part?.name} required />
      <div className="row">
        <Input label="Número de parte" name="partNumber" defaultValue={part?.partNumber} required />
        <label className="field">
          <span className="field__label">Categoría</span>
          <select name="category" className="field__input" defaultValue={part?.category} required>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="row">
        <Input label="Ubicación" name="location" defaultValue={part?.location} required />
        <Input label="Precio (USD)" name="unitPrice" type="number" min={0} defaultValue={part?.unitPrice} required />
      </div>
      <div className="row">
        <Input label="Cantidad" name="quantity" type="number" min={0} defaultValue={part?.quantity} required />
        <Input label="Stock mínimo" name="minStock" type="number" min={0} defaultValue={part?.minStock} required />
      </div>
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
          {saving ? 'Guardando…' : part ? 'Guardar cambios' : 'Crear repuesto'}
        </Button>
      </div>
    </form>
  );
}
