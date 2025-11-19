import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  DollarSign,
  AlertTriangle,
  BarChart3,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { productsService, Product } from '@/services/erpService';
import { useCustomToast } from '@/hooks/use-custom-toast';

export default function StockControl() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    cost_price: 0,
    sale_price: 0,
    current_stock: 0,
    min_stock: 0,
    unit: 'unidad'
  });
  const { showToast, ToastComponent } = useCustomToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      await productsService.create(newProduct);
      showToast('Producto agregado exitosamente', 'success');
      setIsAddDialogOpen(false);
      setNewProduct({
        name: '',
        sku: '',
        cost_price: 0,
        sale_price: 0,
        current_stock: 0,
        min_stock: 0,
        unit: 'unidad'
      });
      loadProducts();
    } catch (error) {
      showToast('Error al agregar producto', 'error');
    }
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct) return;
    try {
      await productsService.adjustStock(
        selectedProduct.id,
        adjustmentQuantity,
        'adjustment',
        'Ajuste manual de stock'
      );
      showToast('Stock ajustado exitosamente', 'success');
      setIsAdjustDialogOpen(false);
      setAdjustmentQuantity(0);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      showToast('Error al ajustar stock', 'error');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockValue = products.reduce((sum, p) => sum + (p.current_stock * p.cost_price), 0);
  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock && !p.is_service);
  const totalProducts = products.length;

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      {ToastComponent}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Control de Stock
          </h1>
          <p className="text-text-secondary">
            Gestiona tus productos y existencias
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Valor del Stock</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${totalStockValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Productos</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Stock Bajo</p>
                  <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Margen Promedio</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.length > 0
                      ? Math.round(products.reduce((sum, p) =>
                          sum + ((p.sale_price - p.cost_price) / p.sale_price * 100 || 0), 0) / products.length)
                      : 0}%
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Completa los datos del producto para agregarlo al inventario
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Producto ejemplo"
                  />
                </div>
                <div>
                  <Label htmlFor="sku">SKU / Código</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="PRD-001"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost_price">Precio de Costo</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      value={newProduct.cost_price}
                      onChange={(e) => setNewProduct({ ...newProduct, cost_price: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sale_price">Precio de Venta</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      value={newProduct.sale_price}
                      onChange={(e) => setNewProduct({ ...newProduct, sale_price: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_stock">Stock Inicial</Label>
                    <Input
                      id="current_stock"
                      type="number"
                      value={newProduct.current_stock}
                      onChange={(e) => setNewProduct({ ...newProduct, current_stock: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_stock">Stock Mínimo</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={newProduct.min_stock}
                      onChange={(e) => setNewProduct({ ...newProduct, min_stock: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProduct} disabled={!newProduct.name}>
                  Agregar Producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Inventario de Productos</CardTitle>
            <CardDescription>
              {filteredProducts.length} productos encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary mb-4">
                  {searchTerm ? 'No se encontraron productos' : 'No hay productos registrados'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar primer producto
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{product.name}</p>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                          {product.sku && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {product.sku}
                            </span>
                          )}
                          <span>
                            Costo: ${product.cost_price} | Venta: ${product.sale_price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          product.current_stock <= product.min_stock ? 'text-orange-600' : 'text-text-primary'
                        }`}>
                          {product.current_stock} {product.unit}s
                        </p>
                        <p className="text-xs text-text-tertiary">
                          Mín: {product.min_stock}
                        </p>
                      </div>

                      {product.current_stock <= product.min_stock && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Stock bajo
                        </Badge>
                      )}

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAdjustmentQuantity(1);
                            setIsAdjustDialogOpen(true);
                          }}
                          className="text-green-600 hover:text-green-700 hover:bg-green-100"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setAdjustmentQuantity(-1);
                            setIsAdjustDialogOpen(true);
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-100"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adjust Stock Dialog */}
        <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajustar Stock</DialogTitle>
              <DialogDescription>
                {selectedProduct?.name} - Stock actual: {selectedProduct?.current_stock}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="adjustment">Cantidad a ajustar</Label>
              <Input
                id="adjustment"
                type="number"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(Number(e.target.value))}
                placeholder="Use valores negativos para restar"
              />
              <p className="text-sm text-text-tertiary mt-2">
                Nuevo stock: {(selectedProduct?.current_stock || 0) + adjustmentQuantity}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdjustStock}>
                Confirmar Ajuste
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
