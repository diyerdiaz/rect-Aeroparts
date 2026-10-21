import { useCallback, useEffect, useMemo, useState } from 'react';
import * as inventoryService from '../services/inventoryService';
import { isLowStock, type Category, type Product, type ProductInput, type Supplier } from '../types/product';

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [p, c, s] = await Promise.all([
        inventoryService.getProducts(),
        inventoryService.getCategories(),
        inventoryService.getSuppliers(),
      ]);
      setProducts(p);
      setCategories(c);
      setSuppliers(s);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProduct = useCallback(async (data: ProductInput) => {
    const product = await inventoryService.createProduct(data);
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback(async (current: Product, data: ProductInput) => {
    const product = await inventoryService.updateProduct(current, data);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const removeProduct = useCallback(async (id: number) => {
    await inventoryService.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const supplierNames = useMemo(() => new Map(suppliers.map((s) => [s.id, s.name])), [suppliers]);

  const metrics = useMemo(
    () => ({
      references: products.length,
      units: products.reduce((sum, p) => sum + p.stock_quantity, 0),
      lowStock: products.filter(isLowStock).length,
      value: products.reduce((sum, p) => sum + p.stock_quantity * p.price, 0),
    }),
    [products],
  );

  return {
    products,
    categories,
    suppliers,
    categoryNames,
    supplierNames,
    loading,
    error,
    metrics,
    reload: load,
    addProduct,
    updateProduct,
    removeProduct,
  };
}
