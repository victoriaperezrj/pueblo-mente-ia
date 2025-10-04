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
import { LoadingCards } from "@/components/LoadingCards";

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
  const [submitting, setSubmitting] = useState(false);
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
      const { data: businesses, error } = await supabase
        .from("businesses")
        .select("id")
        .limit(1)
        .single();

      if (error) throw error;

      if (businesses) {
        setCurrentBusiness(businesses.id);
        loadProducts(businesses.id);
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información. Intentá de nuevo.",
        variant: "destructive",
      });
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

    setSubmitting(true);
    try {
      // Validaciones
      if (!name.trim()) {
        toast({
          title: "Nombre requerido",
          description: "El producto debe tener un nombre",
          variant: "destructive",
        });
        return;
      }

      const stock = parseFloat(currentStock);
      const minStockNum = parseFloat(minStock);
      const costPriceNum = costPrice ? parseFloat(costPrice) : null;
      const sellingPriceNum = parseFloat(sellingPrice);

      if (stock < 0 || minStockNum < 0 || (costPriceNum !== null && costPriceNum < 0) || sellingPriceNum <= 0) {
        toast({
          title: "Valores inválidos",
          description: "Los precios y cantidades no pueden ser negativos",
          variant: "destructive",
        });
        return;
      }

      const { data: productData, error } = await supabase
        .from("products")
        .insert({
          business_id: currentBusiness,
          name: name.trim(),
          description,
          category,
          current_stock: stock,
          min_stock: minStockNum,
          cost_price: costPriceNum,
          selling_price: sellingPriceNum,
          unit,
        })
        .select()
        .single();

      if (error) throw error;

      // 🚀 EVENT-DRIVEN: Register product.created event
      try {
        await supabase.from("outbox_events").insert({
          event_type: "product.created",
          aggregate_id: productData.id,
          aggregate_type: "product",
          business_id: currentBusiness,
          payload: {
            product_id: productData.id,
            name,
            category,
            initial_stock: parseFloat(currentStock),
            selling_price: parseFloat(sellingPrice),
            timestamp: new Date().toISOString(),
          },
        });
      } catch (eventError) {
        console.warn("Event registration failed:", eventError);
      }

      toast({
        title: "✓ Producto agregado",
        description: "El producto se agregó al inventario",
      });

      setDialogOpen(false);
      resetForm();
      loadProducts(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error al guardar",
        description: "No se pudo completar la acción. Intentá de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({ active: false })
        .eq("id", id);

      if (error) throw error;

      toast({ 
        title: "✓ Producto eliminado",
        description: "El producto fue eliminado del inventario",
      });
      if (currentBusiness) loadProducts(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: "No se pudo completar la acción. Intentá de nuevo.",
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
  const totalValue = parseFloat(products.reduce((sum, p) => sum + (p.current_stock * p.selling_price), 0).toFixed(2));

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Inventario 📦</h1>
            <p className="text-muted-foreground mt-1">Gestión de productos y stock</p>
          </div>
        </div>
        <LoadingCards count={3} />
      </div>
    );
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
                  <Label>
                    Nombre del Producto <span className="text-red-500">*</span>
                  </Label>
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
                    <Label>
                      Stock Actual <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      value={currentStock}
                      onChange={(e) => setCurrentStock(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Stock Mínimo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Unidad de Medida</Label>
                  <Input
                    placeholder="Ej: unidad, kg, litro"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio Costo (¿Cuánto te costó?)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Precio Venta <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)} 
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </Button>
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
