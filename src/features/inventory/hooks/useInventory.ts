import { useCallback, useEffect, useMemo, useState } from 'react';
import * as inventoryService from '../services/inventoryService';
import type { NewPart, Part } from '../types/part';

export function useInventory() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    inventoryService
      .getParts()
      .then(setParts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const addPart = useCallback(async (data: NewPart) => {
    const part = await inventoryService.createPart(data);
    setParts((prev) => [part, ...prev]);
  }, []);

  const updatePart = useCallback(async (id: string, data: NewPart) => {
    const part = await inventoryService.updatePart(id, data);
    setParts((prev) => prev.map((p) => (p.id === id ? part : p)));
  }, []);

  const removePart = useCallback(async (id: string) => {
    await inventoryService.deletePart(id);
    setParts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const metrics = useMemo(
    () => ({
      references: parts.length,
      units: parts.reduce((sum, p) => sum + p.quantity, 0),
      lowStock: parts.filter((p) => p.quantity < p.minStock).length,
      value: parts.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0),
    }),
    [parts],
  );

  return { parts, loading, error, metrics, addPart, updatePart, removePart };
}
