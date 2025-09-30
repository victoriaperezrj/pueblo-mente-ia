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
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Plus, Trash2, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Expense {
  id: string;
  category: string;
  amount: number;
  expense_date: string;
  payment_method: string;
  vendor_name: string;
  notes: string;
}

const CATEGORIES = [
  "Alquiler",
  "Servicios",
  "Sueldos",
  "Proveedores",
  "Impuestos",
  "Marketing",
  "Mantenimiento",
  "Otro"
];

const PAYMENT_METHODS = ["Efectivo", "Transferencia", "Débito", "Crédito", "Otro"];

const Expenses = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<string | null>(null);

  // Form state
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get first business (in real app, user would select)
      const { data: businesses } = await supabase
        .from("businesses")
        .select("id")
        .limit(1)
        .single();

      if (businesses) {
        setCurrentBusiness(businesses.id);
        loadExpenses(businesses.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  const loadExpenses = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("business_id", businessId)
        .order("expense_date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
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
      const { error } = await supabase.from("expenses").insert({
        business_id: currentBusiness,
        category,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        vendor_name: vendorName,
        notes,
      });

      if (error) throw error;

      toast({
        title: "✓ Gasto registrado",
        description: "El gasto se agregó correctamente",
      });

      setDialogOpen(false);
      resetForm();
      loadExpenses(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este gasto?")) return;

    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "✓ Gasto eliminado" });
      if (currentBusiness) loadExpenses(currentBusiness);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCategory("");
    setAmount("");
    setPaymentMethod("");
    setVendorName("");
    setNotes("");
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) {
    return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <TrendingDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Primero creá un negocio para registrar gastos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Gastos 💰</h1>
          <p className="text-muted-foreground mt-1">Control de egresos y finanzas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="lg" className="shadow-lg">
              <Plus className="mr-2 h-5 w-5" />
              Nuevo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Gasto</DialogTitle>
              <DialogDescription>Agregá un nuevo egreso a tu negocio</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monto *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Proveedor</Label>
                <Input
                  placeholder="Nombre del proveedor"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  placeholder="Descripción opcional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
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

      {/* Summary Card */}
      <Card className="border-2 border-warning/30 bg-gradient-to-br from-warning/10 via-destructive/10 to-destructive/5 overflow-hidden hover:border-warning/50 transition-all duration-300 hover:shadow-2xl">
        <div className="h-1 bg-gradient-warm" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-warm rounded-lg p-2.5">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            Total de Gastos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent">
            ${totalExpenses.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {expenses.length} {expenses.length === 1 ? "gasto registrado" : "gastos registrados"}
          </p>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all duration-300">
        <div className="h-1 bg-gradient-primary" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-primary rounded-lg p-2">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            Registro de Gastos
          </CardTitle>
          <CardDescription>Historial completo de egresos</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <TrendingDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No hay gastos registrados aún</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {format(new Date(expense.expense_date), "dd MMM yyyy", { locale: es })}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{expense.category}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {expense.vendor_name || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {expense.payment_method || "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        ${expense.amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id)}
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

export default Expenses;
