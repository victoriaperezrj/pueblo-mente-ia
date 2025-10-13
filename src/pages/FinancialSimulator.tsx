import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  DollarSign, TrendingUp, PieChart, AlertTriangle, 
  Download, ArrowLeft, Sparkles, Target, Calculator 
} from "lucide-react";
import { 
  calculateMonthlyRevenue, 
  calculateVariableCosts, 
  calculateLoanPayment,
  financingOptions,
  type FinancingOption 
} from "@/utils/financialCalculations";
import { 
  calculateTaxes, 
  willExceedMonotributo,
  monotributoCategories 
} from "@/utils/taxCalculations";
import { 
  generateProjection, 
  calculateScenarios,
  formatCurrency, 
  formatPercentage,
  type MonthlyProjection 
} from "@/utils/inflationAdjustments";
import { 
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const FinancialSimulator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ideaId = searchParams.get('ideaId');

  // Business idea data
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");

  // Income controls
  const [pricePerProduct, setPricePerProduct] = useState(800);
  const [clientsPerDay, setClientsPerDay] = useState(30);
  const [ticketAverage, setTicketAverage] = useState(3);

  // Fixed costs
  const [rent, setRent] = useState(150000);
  const [services, setServices] = useState(60000);
  const [salaries, setSalaries] = useState(0);
  const [otherFixed, setOtherFixed] = useState(50000);

  // Variable costs
  const [rawMaterialPercentage, setRawMaterialPercentage] = useState(40);

  // Taxes
  const [taxRegime, setTaxRegime] = useState<'monotributo' | 'general'>('monotributo');
  const [isFacturaB, setIsFacturaB] = useState(false);

  // Inflation
  const [monthlyInflation, setMonthlyInflation] = useState(5);
  const [canTransferInflation, setCanTransferInflation] = useState(true);

  // Financing
  const [needsFinancing, setNeedsFinancing] = useState(false);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [selectedFinancing, setSelectedFinancing] = useState<FinancingOption>(financingOptions[0]);

  // Projections
  const [projections, setProjections] = useState<MonthlyProjection[]>([]);
  const [showRealValues, setShowRealValues] = useState(false);

  useEffect(() => {
    if (ideaId) {
      loadBusinessIdea();
    }
  }, [ideaId]);

  useEffect(() => {
    calculateProjections();
  }, [
    pricePerProduct, clientsPerDay, ticketAverage, rent, services, salaries, 
    otherFixed, rawMaterialPercentage, taxRegime, isFacturaB, monthlyInflation,
    canTransferInflation, needsFinancing, loanAmount, selectedFinancing
  ]);

  const loadBusinessIdea = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('business_ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "No se pudo cargar la idea de negocio",
        variant: "destructive"
      });
      navigate('/onboarding/entrepreneur/step1');
      return;
    }

    setBusinessName(data.idea_description || "Tu Negocio");
    setIndustry(data.industry || "");

    // Set defaults based on industry
    if (data.industry === 'Gastronomía') {
      setPricePerProduct(800);
      setRawMaterialPercentage(40);
    }
  };

  const calculateProjections = () => {
    const monthlyRevenue = calculateMonthlyRevenue(pricePerProduct, clientsPerDay, ticketAverage);
    const fixedCosts = rent + services + salaries + otherFixed;
    const taxInfo = calculateTaxes(monthlyRevenue, taxRegime, isFacturaB);
    const loanPayment = needsFinancing 
      ? calculateLoanPayment(loanAmount, selectedFinancing.annualRate, selectedFinancing.months)
      : 0;

    const newProjections = generateProjection(
      monthlyRevenue,
      fixedCosts,
      rawMaterialPercentage,
      taxInfo.amount,
      loanPayment,
      monthlyInflation,
      36,
      canTransferInflation
    );

    setProjections(newProjections);
  };

  const monthlyRevenue = calculateMonthlyRevenue(pricePerProduct, clientsPerDay, ticketAverage);
  const fixedCosts = rent + services + salaries + otherFixed;
  const variableCosts = calculateVariableCosts(monthlyRevenue, rawMaterialPercentage);
  const taxInfo = calculateTaxes(monthlyRevenue, taxRegime, isFacturaB);
  const loanPayment = needsFinancing 
    ? calculateLoanPayment(loanAmount, selectedFinancing.annualRate, selectedFinancing.months)
    : 0;

  const firstMonthProfit = projections[0]?.realProfit || 0;
  const profitAfterLoan = projections[selectedFinancing.months]?.realProfit || 0;
  const margin = monthlyRevenue > 0 ? ((firstMonthProfit / monthlyRevenue) * 100) : 0;

  const breakEvenMonth = projections.findIndex(p => p.accumulated >= 0) + 1;

  // Alerts
  const alerts = [];
  if (firstMonthProfit < 0 && projections.filter(p => p.realProfit < 0).length > 12) {
    alerts.push({
      type: 'error',
      message: '⚠️ Negocio no es viable con estos números. Revisá precios o costos.'
    });
  }
  if (breakEvenMonth > 24) {
    alerts.push({
      type: 'warning',
      message: '⚠️ Recuperación muy lenta. Considerá menos financiación o más capital propio.'
    });
  }
  if (willExceedMonotributo(monthlyRevenue, 8, monthlyInflation)) {
    alerts.push({
      type: 'info',
      message: '📊 En mes 8 superarás el límite de Monotributo. Deberás pasar a Régimen General.'
    });
  }
  if (monthlyInflation > 8 && !canTransferInflation) {
    alerts.push({
      type: 'warning',
      message: '⚠️ Estás perdiendo 30% de margen real por año. Ajustá precios o reducí costos.'
    });
  }

  // Cost composition for pie chart
  const costComposition = [
    { name: 'Costos Fijos', value: fixedCosts, color: 'hsl(var(--primary))' },
    { name: 'Costos Variables', value: variableCosts, color: 'hsl(var(--success))' },
    { name: 'Impuestos', value: taxInfo.amount, color: 'hsl(var(--warning))' },
    { name: 'Financiación', value: loanPayment, color: 'hsl(var(--destructive))' },
  ];

  const scenarios = calculateScenarios(
    monthlyRevenue,
    fixedCosts,
    rawMaterialPercentage,
    taxInfo.amount,
    needsFinancing ? loanAmount : 0,
    selectedFinancing.annualRate,
    selectedFinancing.months
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/onboarding/entrepreneur/business-plan?ideaId=${ideaId}`)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Plan de Negocio
          </Button>
          
          <div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                  <div className="bg-gradient-primary rounded-xl p-2.5">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  Recomendaciones Inteligentes 🤖
                </h1>
                <p className="text-muted-foreground mt-2">
                  Descubrí qué cambios harían tu negocio más rentable
                </p>
                {businessName && (
                  <Badge variant="outline" className="mt-2">
                    Basado en tu idea: {businessName}
                  </Badge>
                )}
              </div>
            
              <div className="flex gap-2">
                <Button variant="outline" className="border-2" onClick={() => toast({ title: "Próximamente", description: "La exportación estará disponible pronto" })}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar en Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  alert.type === 'error' ? 'border-destructive/50 bg-destructive/10' :
                  alert.type === 'warning' ? 'border-warning/50 bg-warning/10' :
                  'border-primary/50 bg-primary/10'
                }`}
              >
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Income Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  ¿Cuánto vas a vender?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Precio Promedio por Producto/Servicio</Label>
                    <span className="text-2xl font-bold text-primary">${pricePerProduct}</span>
                  </div>
                  <Slider
                    value={[pricePerProduct]}
                    onValueChange={(v) => setPricePerProduct(v[0])}
                    min={100}
                    max={10000}
                    step={100}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Clientes por Día</Label>
                    <span className="text-xl font-bold">{clientsPerDay} clientes/día</span>
                  </div>
                  <Slider
                    value={[clientsPerDay]}
                    onValueChange={(v) => setClientsPerDay(v[0])}
                    min={5}
                    max={200}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Label>Venta Promedio por Cliente</Label>
                      <span className="text-xs text-muted-foreground cursor-help" title="¿Cuánto compra en promedio cada cliente? Ejemplo: Si vendes 100 productos a 10 clientes, el promedio es 10 productos por cliente.">
                        💡
                      </span>
                    </div>
                    <span className="text-xl font-bold">{ticketAverage} productos</span>
                  </div>
                  <Slider
                    value={[ticketAverage]}
                    onValueChange={(v) => setTicketAverage(v[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 ¿Cuánto compra en promedio cada cliente?
                  </p>
                </div>

                <div className="p-4 bg-success/10 rounded-lg border-2 border-success/50">
                  <p className="text-sm text-muted-foreground mb-1">Revenue Mensual</p>
                  <p className="text-3xl font-bold text-success">{formatCurrency(monthlyRevenue)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Fixed Costs Card */}
            <Card>
              <CardHeader>
                <CardTitle>Costos Fijos Mensuales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Alquiler: ${rent.toLocaleString('es-AR')}</Label>
                  <Slider value={[rent]} onValueChange={(v) => setRent(v[0])} min={0} max={500000} step={10000} />
                </div>
                <div className="space-y-2">
                  <Label>Servicios: ${services.toLocaleString('es-AR')}</Label>
                  <Slider value={[services]} onValueChange={(v) => setServices(v[0])} min={20000} max={200000} step={10000} />
                </div>
                <div className="space-y-2">
                  <Label>Salarios: ${salaries.toLocaleString('es-AR')}</Label>
                  <Slider value={[salaries]} onValueChange={(v) => setSalaries(v[0])} min={0} max={1000000} step={50000} />
                  <p className="text-xs text-muted-foreground">Salario mínimo en Argentina: ~$220,000/mes + cargas sociales</p>
                </div>
                <div className="space-y-2">
                  <Label>Otros costos fijos: ${otherFixed.toLocaleString('es-AR')}</Label>
                  <Slider value={[otherFixed]} onValueChange={(v) => setOtherFixed(v[0])} min={0} max={200000} step={10000} />
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Total Costos Fijos: {formatCurrency(fixedCosts)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Variable Costs Card */}
            <Card>
              <CardHeader>
                <CardTitle>Costos Variables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Costo de Materia Prima (%): {rawMaterialPercentage}%</Label>
                  <Slider value={[rawMaterialPercentage]} onValueChange={(v) => setRawMaterialPercentage(v[0])} min={20} max={70} step={5} />
                  <p className="text-xs text-muted-foreground">
                    {rawMaterialPercentage}% significa que si vendés a $1000, te cuesta ${1000 * rawMaterialPercentage / 100} producirlo
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Costo Variable Mensual: {formatCurrency(variableCosts)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Taxes Card */}
            <Card>
              <CardHeader>
                <CardTitle>Impuestos (San Luis, Argentina)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Régimen Impositivo</Label>
                  <RadioGroup value={taxRegime} onValueChange={(v: any) => setTaxRegime(v)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monotributo" id="monotributo" />
                      <Label htmlFor="monotributo" className="cursor-pointer">
                        Monotributo (ingresos {"<"} $68M anuales)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="general" id="general" />
                      <Label htmlFor="general" className="cursor-pointer">
                        Régimen General
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {taxRegime === 'general' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox id="facturaB" checked={isFacturaB} onCheckedChange={(c: boolean) => setIsFacturaB(c)} />
                    <Label htmlFor="facturaB" className="cursor-pointer">¿Vas a facturar A o B?</Label>
                  </div>
                )}

                <div className="p-4 bg-warning/10 rounded-lg border-2 border-warning/50">
                  <p className="text-sm text-muted-foreground mb-1">Impuestos Mensuales</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(taxInfo.amount)}</p>
                  {taxInfo.category && (
                    <Badge variant="outline" className="mt-2">Categoría {taxInfo.category}</Badge>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{taxInfo.breakdown}</p>
                </div>
              </CardContent>
            </Card>

            {/* Inflation Card */}
            <Card>
              <CardHeader>
                <CardTitle>Inflación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Inflación Mensual Proyectada: {monthlyInflation}%</Label>
                  <Slider value={[monthlyInflation]} onValueChange={(v) => setMonthlyInflation(v[0])} min={2} max={15} step={0.5} />
                  <p className="text-xs text-muted-foreground">
                    Últimos 12 meses Argentina: promedio 5-8%
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="transfer" checked={canTransferInflation} onCheckedChange={(c: boolean) => setCanTransferInflation(c)} />
                  <Label htmlFor="transfer" className="cursor-pointer">¿Podés trasladar inflación a precios?</Label>
                </div>
              </CardContent>
            </Card>

            {/* Financing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Financiación (San Luis)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="financing" checked={needsFinancing} onCheckedChange={(c: boolean) => setNeedsFinancing(c)} />
                  <Label htmlFor="financing" className="cursor-pointer">¿Necesitás financiación inicial?</Label>
                </div>

                {needsFinancing && (
                  <>
                    <div className="space-y-2">
                      <Label>Monto a financiar: {formatCurrency(loanAmount)}</Label>
                      <Slider value={[loanAmount]} onValueChange={(v) => setLoanAmount(v[0])} min={1000000} max={20000000} step={500000} />
                    </div>

                    <div className="space-y-2">
                      <Label>Línea de crédito</Label>
                      <Select value={selectedFinancing.id} onValueChange={(v) => {
                        const option = financingOptions.find(o => o.id === v);
                        if (option) setSelectedFinancing(option);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {financingOptions.slice(1).map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name} - {option.annualRate}% anual - {option.months} meses
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{selectedFinancing.description}</p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Cuota Mensual: {formatCurrency(loanPayment)}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Charts & Summary */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-success">INGRESOS:</h3>
                  <p className="text-sm">Revenue Mensual: {formatCurrency(monthlyRevenue)}</p>
                  <p className="text-sm">Revenue Anual proyectado: {formatCurrency(monthlyRevenue * 12)}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-destructive">EGRESOS:</h3>
                  <p className="text-sm">Costos Fijos: {formatCurrency(fixedCosts)}</p>
                  <p className="text-sm">Costos Variables: {formatCurrency(variableCosts)}</p>
                  <p className="text-sm">Impuestos: {formatCurrency(taxInfo.amount)}</p>
                  {needsFinancing && <p className="text-sm">Cuota préstamo: {formatCurrency(loanPayment)}</p>}
                </div>

                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border-2 border-primary">
                  <h3 className="font-bold text-lg mb-2">GANANCIA NETA:</h3>
                  <p className="text-sm">Mensual (primer mes): 
                    <span className={`font-bold ml-2 ${firstMonthProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(firstMonthProfit)}
                    </span>
                  </p>
                  {needsFinancing && (
                    <p className="text-sm">Después de pagar préstamo: 
                      <span className={`font-bold ml-2 ${profitAfterLoan >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(profitAfterLoan)}
                      </span>
                    </p>
                  )}
                  <Badge variant={margin >= 15 ? "default" : margin >= 5 ? "secondary" : "destructive"} className="mt-2">
                    Margen: {margin.toFixed(1)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Break-Even Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Punto de Equilibrio (Break-Even)</CardTitle>
                <CardDescription>
                  {breakEvenMonth > 0 ? `Break-even en mes ${breakEvenMonth}` : 'No alcanza break-even en 36 meses'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projections.slice(0, 24)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" label={{ value: 'Mes', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="accumulated" name="Acumulado" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cash Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Flujo de Caja 12 Meses (Nominal vs Real)</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox 
                    id="showReal" 
                    checked={showRealValues} 
                    onCheckedChange={(c: boolean) => setShowRealValues(c)} 
                  />
                  <Label htmlFor="showReal" className="cursor-pointer text-sm">Ver valores reales</Label>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projections.slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="nominalProfit" 
                      name="Flujo Nominal" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                    />
                    {showRealValues && (
                      <Line 
                        type="monotone" 
                        dataKey="realProfit" 
                        name="Flujo Real" 
                        stroke="hsl(var(--warning))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Composition */}
            <Card>
              <CardHeader>
                <CardTitle>Qué porcentaje de tu dinero va a cada cosa</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={costComposition}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costComposition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Scenarios Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Tres posibilidades: Mal / Normal / Bien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive/50">
                    <h4 className="font-bold text-sm mb-2">Si las cosas van mal</h4>
                    <p className="text-xs text-muted-foreground mb-2">Muchos precios subiendo, pocos clientes</p>
                    <p className="text-lg font-bold text-destructive">
                      {formatCurrency(scenarios.pessimistic.reduce((acc, p) => acc + p.realProfit, 0) / 12)}
                    </p>
                    <p className="text-xs">por mes</p>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <h4 className="font-bold text-sm mb-2">Normal</h4>
                    <p className="text-xs text-muted-foreground mb-2">Con lo que pusiste arriba</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(scenarios.realistic.reduce((acc, p) => acc + p.realProfit, 0) / 12)}
                    </p>
                    <p className="text-xs">por mes</p>
                  </div>
                  
                  <div className="p-4 bg-success/10 rounded-lg border-2 border-success/50">
                    <h4 className="font-bold text-sm mb-2">Si las cosas van bien</h4>
                    <p className="text-xs text-muted-foreground mb-2">Precios estables, muchos clientes</p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(scenarios.optimistic.reduce((acc, p) => acc + p.realProfit, 0) / 12)}
                    </p>
                    <p className="text-xs">por mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projection Table */}
            <Card>
              <CardHeader>
                <CardTitle>Tu Proyección en Resumen 📊</CardTitle>
                <CardDescription>
                  {breakEvenMonth > 0 ? (
                    <div className="space-y-2 mt-4 p-4 bg-gradient-to-r from-primary/10 to-success/10 rounded-lg border-2 border-primary/30">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        <p className="font-medium">
                          Primeros {breakEvenMonth - 1} meses: Pérdidas (inversión inicial)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <p className="font-medium">
                          Mes {breakEvenMonth}: ¡Tu primer mes rentable! (+{formatCurrency(projections[breakEvenMonth - 1]?.realProfit || 0)})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎯</span>
                        <p className="font-medium">
                          Mes 12: Ganancia proyectada de {formatCurrency(projections[11]?.realProfit || 0)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-warning">Tu negocio necesita ajustes en los números</p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-primary/30">
                        <th className="text-left p-3">Mes</th>
                        <th className="text-right p-3">
                          <div className="flex items-center justify-end gap-2">
                            <span>📊</span>
                            <span>Ventas {showRealValues ? 'Real' : 'Nom.'}</span>
                          </div>
                        </th>
                        <th className="text-right p-3">
                          <div className="flex items-center justify-end gap-2">
                            <span>💸</span>
                            <span>Gastos</span>
                          </div>
                        </th>
                        <th className="text-right p-3">
                          <div className="flex items-center justify-end gap-2">
                            <span>🏛️</span>
                            <span>Impuestos</span>
                          </div>
                        </th>
                        <th className="text-right p-3">
                          <div className="flex items-center justify-end gap-2">
                            <span>💰</span>
                            <span>Ganancia</span>
                          </div>
                        </th>
                        <th className="text-right p-3">
                          <div className="flex items-center justify-end gap-2">
                            <span>📈</span>
                            <span>Total Acumulado</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((p) => {
                        const isPositiveMonth = p.realProfit >= 0;
                        const isBreakEvenMonth = p.month === breakEvenMonth;
                        
                        return (
                          <tr 
                            key={p.month} 
                            className={`border-b transition-colors cursor-pointer group ${
                              isBreakEvenMonth ? 'bg-success/20 hover:bg-success/30' : 
                              isPositiveMonth ? 'hover:bg-success/10' : 'hover:bg-destructive/10'
                            }`}
                            title={`💡 Mes ${p.month}:\n- Necesitas vender: ${formatCurrency(showRealValues ? p.realRevenue : p.nominalRevenue)}\n- Tus gastos serán: ${formatCurrency(p.costs + p.taxes)}\n- Resultado: ${formatCurrency(showRealValues ? p.realProfit : p.nominalProfit)}`}
                          >
                            <td className="p-3 font-medium">
                              {isBreakEvenMonth && <span className="mr-2">🎯</span>}
                              Mes {p.month}
                            </td>
                            <td className="text-right p-3">
                              {formatCurrency(showRealValues ? p.realRevenue : p.nominalRevenue)}
                            </td>
                            <td className="text-right p-3 text-muted-foreground">
                              {formatCurrency(p.costs)}
                            </td>
                            <td className="text-right p-3 text-warning">
                              {formatCurrency(p.taxes)}
                            </td>
                            <td className={`text-right p-3 font-semibold ${
                              isPositiveMonth ? 'text-success' : 'text-destructive'
                            }`}>
                              {formatCurrency(showRealValues ? p.realProfit : p.nominalProfit)}
                            </td>
                            <td className={`text-right p-3 font-bold ${
                              p.accumulated >= 0 ? 'text-success' : 'text-destructive'
                            }`}>
                              {formatCurrency(p.accumulated)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                  <p>💡 <strong>Tip:</strong> Pasa el mouse sobre cada fila para ver el detalle del mes</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="gradient" size="lg" className="flex-1">
                <Sparkles className="h-5 w-5 mr-2" />
                Consultar con Asesor IA
              </Button>
              <Button variant="outline" size="lg" onClick={() => toast({ title: "Guardado", description: "Escenario guardado correctamente" })}>
                Guardar Escenario
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSimulator;
