import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, TrendingUp, DollarSign, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Sale {
  id: string;
  sale_date: string;
  total_amount: number;
  payment_method: string;
  items: any;
  notes: string;
  customer_id: string | null;
}

interface Product {
  id: string;
  name: string;
  selling_price: number;
  current_stock: number;
  unit: string;
}

const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Débito", "Crédito", "MercadoPago", "Otro"];

const Sales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<string | null>(null);

  // Form state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [notes, setNotes] = useState("");

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
        loadSales(businesses.id);
        loadProducts(businesses.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const loadSales = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("business_id", businessId)
        .order("sale_date", { ascending: false });

      if (error) throw error;
      setSales(data || []);
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

  const loadProducts = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, selling_price, current_stock, unit")
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness || !selectedProduct) return;

    try {
      const product = products.find(p => p.id === selectedProduct);
      if (!product) return;

      const qty = parseFloat(quantity);
      const totalAmount = product.selling_price * qty;

      const { error } = await supabase.from("sales").insert({
        business_id: currentBusiness,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        items: [{
          product_id: product.id,
          product_name: product.name,
          quantity: qty,
          unit_price: product.selling_price,
          subtotal: totalAmount
        }],
        notes,
      });

      if (error) throw error;

      // Update product stock
      const { error: stockError } = await supabase
        .from("products")
        .update({ current_stock: product.current_stock - qty })
        .eq("id", product.id);

      if (stockError) throw stockError;

      toast({
        title: "✓ Venta registrada",
        description: `Total: $${totalAmount.toLocaleString("es-AR")}`,
      });

      setDialogOpen(false);
      resetForm();
      loadSales(currentBusiness);
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
    if (!confirm("¿Eliminar esta venta?")) return;

    try {
      const { error } = await supabase.from("sales").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "✓ Venta eliminada" });
      if (currentBusiness) loadSales(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedProduct("");
    setQuantity("");
    setPaymentMethod("Efectivo");
    setNotes("");
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const todaySales = sales.filter(s => {
    const saleDate = new Date(s.sale_date);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  });
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0);

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Primero creá un negocio para registrar ventas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Ventas 🛒</h1>
          <p className="text-muted-foreground mt-1">Registro de transacciones</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg" className="shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Venta</DialogTitle>
              <DialogDescription>Agregá una nueva transacción</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Producto *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No hay productos. Agregá productos en Inventario.
                      </div>
                    ) : (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.selling_price} ({product.current_stock} {product.unit})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cantidad *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              {selectedProduct && quantity && (
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${(products.find(p => p.id === selectedProduct)?.selling_price || 0) * parseFloat(quantity || "0")}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Método de Pago *</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  placeholder="Notas opcionales"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={products.length === 0}>
                  Registrar Venta
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-2 border-success/30 bg-gradient-to-br from-success/5 to-success/10 overflow-hidden hover:border-success/50 transition-all duration-300 hover:shadow-2xl">
          <div className="h-1 bg-gradient-success" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-success rounded-lg p-2.5">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              Ventas de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-success bg-clip-text text-transparent">
              ${todayTotal.toLocaleString("es-AR")}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {todaySales.length} {todaySales.length === 1 ? "venta" : "ventas"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
          <div className="h-1 bg-gradient-primary" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-primary rounded-lg p-2.5">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              Total Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ${totalSales.toLocaleString("es-AR")}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {sales.length} ventas registradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/5 to-warning/10 overflow-hidden hover:border-warning/50 transition-all duration-300 hover:shadow-2xl">
          <div className="h-1 bg-gradient-warm" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="bg-gradient-warm rounded-lg p-2">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              ${sales.length > 0 ? (totalSales / sales.length).toFixed(0) : 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">por venta</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>Todas las transacciones registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay ventas registradas aún</p>
              <p className="text-sm text-muted-foreground mt-1">
                {products.length === 0 
                  ? "Primero agregá productos en Inventario" 
                  : "Registrá tu primera venta"}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {format(new Date(sale.sale_date), "dd MMM yyyy HH:mm", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {sale.items.map((item: any, idx: number) => (
                            <div key={idx} className="text-sm">
                              <span className="font-medium">{item.product_name}</span>
                              <span className="text-muted-foreground"> x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{sale.payment_method}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-success text-lg">
                        ${sale.total_amount.toLocaleString("es-AR")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sale.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
