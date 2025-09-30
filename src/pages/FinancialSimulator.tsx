import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calculator, TrendingUp, DollarSign, AlertCircle, CheckCircle, Loader2, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface SimulationResult {
  monthlyRevenue: number;
  monthlyCosts: number;
  monthlyProfit: number;
  profitMargin: number;
  breakEvenUnits: number;
  yearlyProjection: {
    revenue: number;
    costs: number;
    profit: number;
  };
  roi: number;
  paybackPeriod: number;
}

interface AIAnalysis {
  analysis: string;
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  verdict: string;
}

const FinancialSimulator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form state
  const [initialInvestment, setInitialInvestment] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCost, setProductCost] = useState("");
  const [unitsPerMonth, setUnitsPerMonth] = useState("");
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCosts, setVariableCosts] = useState("");

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const price = parseFloat(productPrice);
      const cost = parseFloat(productCost);
      const units = parseFloat(unitsPerMonth);
      const fixed = parseFloat(fixedCosts);
      const variable = parseFloat(variableCosts);
      const investment = parseFloat(initialInvestment);

      const monthlyRevenue = price * units;
      const monthlyCosts = fixed + (cost * units) + variable;
      const monthlyProfit = monthlyRevenue - monthlyCosts;
      const profitMargin = (monthlyProfit / monthlyRevenue) * 100;
      const breakEvenUnits = fixed / (price - cost);

      const yearlyRevenue = monthlyRevenue * 12;
      const yearlyCosts = monthlyCosts * 12;
      const yearlyProfit = monthlyProfit * 12;

      const roi = (yearlyProfit / investment) * 100;
      const paybackPeriod = investment / monthlyProfit;

      const mockResult: SimulationResult = {
        monthlyRevenue,
        monthlyCosts,
        monthlyProfit,
        profitMargin,
        breakEvenUnits,
        yearlyProjection: {
          revenue: yearlyRevenue,
          costs: yearlyCosts,
          profit: yearlyProfit
        },
        roi,
        paybackPeriod
      };

      setResult(mockResult);
      setLoading(false);
      
      toast({
        title: "✓ Simulación completa",
        description: "Proyecciones calculadas correctamente",
      });
    }, 2000);
  };

  const generateAIAnalysis = async () => {
    if (!result) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('simulate-financial', {
        body: {
          initialInvestment: parseFloat(initialInvestment),
          productPrice: parseFloat(productPrice),
          productCost: parseFloat(productCost),
          unitsPerMonth: parseFloat(unitsPerMonth),
          fixedCosts: parseFloat(fixedCosts),
          variableCosts: parseFloat(variableCosts || "0"),
          results: {
            monthlyRevenue: result.monthlyRevenue,
            yearlyRevenue: result.yearlyProjection.revenue,
            monthlyCost: result.monthlyCosts,
            yearlyCost: result.yearlyProjection.costs,
            monthlyProfit: result.monthlyProfit,
            yearlyProfit: result.yearlyProjection.profit,
            profitMargin: result.profitMargin,
            breakEvenUnits: result.breakEvenUnits,
            roi: result.roi,
            paybackPeriod: result.paybackPeriod
          }
        }
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from AI');
      }

      setAiAnalysis(data);
      
      toast({
        title: "✓ Análisis completo",
        description: "La IA ha analizado tu simulación financiera",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo completar el análisis. Intentá de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setInitialInvestment("");
    setProductPrice("");
    setProductCost("");
    setUnitsPerMonth("");
    setFixedCosts("");
    setVariableCosts("");
    setResult(null);
    setAiAnalysis(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="bg-gradient-primary rounded-xl p-2.5">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          Simulador Financiero 📊
        </h1>
        <p className="text-muted-foreground mt-2">
          Proyectá ventas, costos y rentabilidad de tu negocio
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-6">
          <form onSubmit={handleSimulate} className="space-y-6">
            <Card className="border-2 overflow-hidden">
              <div className="h-1 bg-gradient-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Datos del Negocio
                </CardTitle>
                <CardDescription>
                  Ingresá la información de tu emprendimiento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initialInvestment">Inversión Inicial ($) *</Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    placeholder="500000"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="productPrice">Precio Unitario ($) *</Label>
                    <Input
                      id="productPrice"
                      type="number"
                      placeholder="2500"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productCost">Costo Unitario ($) *</Label>
                    <Input
                      id="productCost"
                      type="number"
                      placeholder="1000"
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitsPerMonth">Unidades/Mes *</Label>
                  <Input
                    id="unitsPerMonth"
                    type="number"
                    placeholder="200"
                    value={unitsPerMonth}
                    onChange={(e) => setUnitsPerMonth(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="fixedCosts">Costos Fijos/Mes ($) *</Label>
                    <Input
                      id="fixedCosts"
                      type="number"
                      placeholder="150000"
                      value={fixedCosts}
                      onChange={(e) => setFixedCosts(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Alquiler, sueldos, servicios
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variableCosts">Costos Variables/Mes ($)</Label>
                    <Input
                      id="variableCosts"
                      type="number"
                      placeholder="50000"
                      value={variableCosts}
                      onChange={(e) => setVariableCosts(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Marketing, mantenimiento
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  variant="gradient"
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Simulando...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-5 w-5" />
                      Simular Resultados
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {!result ? (
            <Card className="border-2 overflow-hidden">
              <div className="h-1 bg-gradient-success" />
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-success rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Completá el formulario</h3>
                    <p className="text-sm text-muted-foreground">
                      Ingresá los datos de tu negocio para ver las proyecciones financieras
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Monthly Results */}
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                <div className="h-1 bg-gradient-primary" />
                <CardHeader>
                  <CardTitle>Resultados Mensuales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ingresos</p>
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(result.monthlyRevenue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Costos</p>
                      <p className="text-2xl font-bold text-warning">
                        {formatCurrency(result.monthlyCosts)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-background/50 rounded-lg p-4 border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ganancia Neta</p>
                    <p className={`text-3xl font-bold ${result.monthlyProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(result.monthlyProfit)}
                    </p>
                    <Badge variant={result.profitMargin >= 20 ? "default" : "secondary"} className="mt-2">
                      Margen: {result.profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Break Even */}
              <Card className="border-2 border-warning/30 overflow-hidden">
                <div className="h-1 bg-gradient-warm" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Punto de Equilibrio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Necesitás vender al menos:
                  </p>
                  <p className="text-3xl font-bold">
                    {Math.ceil(result.breakEvenUnits)} unidades/mes
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Para cubrir todos los costos
                  </p>
                </CardContent>
              </Card>

              {/* Yearly Projection */}
              <Card className="border-2 border-success/30 overflow-hidden">
                <div className="h-1 bg-gradient-success" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Proyección Anual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ingresos Anuales</span>
                    <span className="font-semibold">{formatCurrency(result.yearlyProjection.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Costos Anuales</span>
                    <span className="font-semibold">{formatCurrency(result.yearlyProjection.costs)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-medium">Ganancia Anual</span>
                    <span className="text-xl font-bold text-success">
                      {formatCurrency(result.yearlyProjection.profit)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* ROI & Payback */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-primary" />
                  <CardHeader>
                    <CardTitle className="text-base">ROI Anual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${result.roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {result.roi.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 overflow-hidden">
                  <div className="h-1 bg-gradient-success" />
                  <CardHeader>
                    <CardTitle className="text-base">Recupero</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {result.paybackPeriod.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground">meses</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="border-2 border-accent/30 overflow-hidden">
                <div className="h-1 bg-gradient-hero" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Análisis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.profitMargin >= 20 && (
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Excelente margen de ganancia ({result.profitMargin.toFixed(1)}%)</span>
                    </p>
                  )}
                  {result.profitMargin < 20 && result.profitMargin >= 10 && (
                    <p className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span>Margen aceptable, considerá optimizar costos</span>
                    </p>
                  )}
                  {result.roi >= 50 && (
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>ROI muy atractivo para inversores</span>
                    </p>
                  )}
                  {result.paybackPeriod <= 12 && (
                    <p className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Recupero rápido de inversión (menos de 1 año)</span>
                    </p>
                  )}
                  {result.paybackPeriod > 24 && (
                    <p className="text-sm flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span>Recupero lento, evaluá aumentar ventas o reducir costos</span>
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* AI Analysis Button */}
              {!aiAnalysis && (
                <Button 
                  variant="gradient" 
                  size="lg" 
                  onClick={generateAIAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analizando con IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Obtener Análisis de IA
                    </>
                  )}
                </Button>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && (
                <div className="space-y-6 animate-fade-in">
                  {/* Verdict */}
                  <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 overflow-hidden">
                    <div className="h-1 bg-gradient-hero" />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-gradient-primary rounded-lg p-2">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        Veredicto de IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold">{aiAnalysis.verdict}</p>
                    </CardContent>
                  </Card>

                  {/* Analysis */}
                  <Card className="border-2 overflow-hidden">
                    <div className="h-1 bg-gradient-primary" />
                    <CardHeader>
                      <CardTitle>Análisis Detallado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{aiAnalysis.analysis}</p>
                    </CardContent>
                  </Card>

                  {/* Recommendations, Risks, Opportunities */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-2 border-success/30 overflow-hidden">
                      <div className="h-1 bg-gradient-success" />
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-success" />
                          Recomendaciones
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {aiAnalysis.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-destructive/30 overflow-hidden">
                      <div className="h-1 bg-gradient-warm" />
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          Riesgos
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {aiAnalysis.risks.map((risk, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/30 overflow-hidden">
                      <div className="h-1 bg-gradient-primary" />
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Oportunidades
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {aiAnalysis.opportunities.map((opp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <Button variant="outline" size="lg" onClick={resetForm} className="w-full">
                <Calculator className="mr-2 h-5 w-5" />
                Nueva Simulación
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSimulator;
