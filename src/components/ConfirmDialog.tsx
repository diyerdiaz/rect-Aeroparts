import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Eliminar', onConfirm, onClose }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose} size="sm">
      <p className="muted">{message}</p>
      <div className="row row--end modal__actions">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={busy}>
          {busy ? 'Eliminando…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
