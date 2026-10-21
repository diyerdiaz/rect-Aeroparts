import { useId, useRef, useState, type DragEvent } from 'react';
import { ImageIcon } from '../../../components/icons';
import { fileToResizedDataUrl } from '../../../utils/image';

interface Props {
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function ImageInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  async function handleFile(file?: File) {
    if (!file) return;
    setError('');
    setProcessing(true);
    try {
      onChange(await fileToResizedDataUrl(file));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="field">
      <span className="field__label">Imagen</span>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="upload upload--filled">
          <img src={value} alt="Vista previa" />
          <div className="upload__actions">
            <label htmlFor={id} className="btn btn--ghost btn--sm">
              Cambiar
            </label>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange(undefined)}>
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`upload ${dragging ? 'is-dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <ImageIcon />
          <span>{processing ? 'Procesando…' : 'Arrastra una imagen o haz clic para subirla'}</span>
          <span className="muted">PNG, JPG o WEBP</span>
        </label>
      )}
      {error && <span className="error">{error}</span>}
    </div>
  );
}
