import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, AlertCircle, TrendingUp, Edit2, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  current_stock: number;
  min_stock: number;
  cost_price: number;
  selling_price: number;
  unit: string;
  active: boolean;
}

const Inventory = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [unit, setUnit] = useState("unidad");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .limit(1)
        .single();

      if (businesses) {
        setCurrentBusiness(businesses.id);
        loadProducts(businesses.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const loadProducts = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", businessId)
        .eq("active", true)
        .order("name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness) return;

    try {
      const { error } = await supabase.from("products").insert({
        business_id: currentBusiness,
        name,
        description,
        category,
        current_stock: parseFloat(currentStock),
        min_stock: parseFloat(minStock),
        cost_price: costPrice ? parseFloat(costPrice) : null,
        selling_price: parseFloat(sellingPrice),
        unit,
      });

      if (error) throw error;

      toast({
        title: "✓ Producto agregado",
        description: "El producto se agregó al inventario",
      });

      setDialogOpen(false);
      resetForm();
      loadProducts(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({ active: false })
        .eq("id", id);

      if (error) throw error;

      toast({ title: "✓ Producto eliminado" });
      if (currentBusiness) loadProducts(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setCurrentStock("");
    setMinStock("");
    setCostPrice("");
    setSellingPrice("");
    setUnit("unidad");
  };

  const lowStockProducts = products.filter(p => p.current_stock <= p.min_stock);
  const totalValue = products.reduce((sum, p) => sum + (p.current_stock * p.selling_price), 0);

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Primero creá un negocio para gestionar inventario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Inventario 📦</h1>
          <p className="text-muted-foreground mt-1">Gestión de productos y stock</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg" className="shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Producto</DialogTitle>
              <DialogDescription>Registrá un nuevo producto en tu inventario</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del Producto *</Label>
                <Input
                  placeholder="Ej: Pan francés"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input
                  placeholder="Ej: Panadería"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Descripción opcional"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock Actual *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock Mínimo *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Unidad</Label>
                <Input
                  placeholder="Ej: unidad, kg, litro"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Precio Costo</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio Venta *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">Guardar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
          <div className="h-1 bg-gradient-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-primary rounded-lg p-2">
                <Package className="h-5 w-5 text-white" />
              </div>
              Total Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10 overflow-hidden hover:border-warning/50 transition-all duration-300 hover:shadow-xl">
          <div className="h-1 bg-gradient-warm" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-warm rounded-lg p-2">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-success/30 bg-gradient-to-br from-success/5 to-success/10 overflow-hidden hover:border-success/50 transition-all duration-300 hover:shadow-xl">
          <div className="h-1 bg-gradient-success" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="bg-gradient-success rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              ${totalValue.toLocaleString("es-AR")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay productos en el inventario</p>
              <p className="text-sm text-muted-foreground mt-1">Comenzá agregando tu primer producto</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="secondary" className="mt-2">
                        {product.category}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <span className={`font-semibold ${product.current_stock <= product.min_stock ? 'text-warning' : 'text-foreground'}`}>
                    {product.current_stock} {product.unit}
                  </span>
                </div>
                {product.current_stock <= product.min_stock && (
                  <div className="bg-warning/10 text-warning text-sm px-3 py-2 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Stock bajo (mín: {product.min_stock})</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="font-bold text-lg text-success">
                    ${product.selling_price.toLocaleString("es-AR")}
                  </span>
                </div>
                {product.cost_price && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Costo:</span>
                    <span>${product.cost_price.toLocaleString("es-AR")}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
