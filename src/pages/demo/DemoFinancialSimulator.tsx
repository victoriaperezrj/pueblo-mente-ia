import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DemoBottomBar } from "@/components/DemoBottomBar";
import { formatCurrency } from "@/lib/finance";
import { useGuestSession } from "@/contexts/GuestSessionProvider";
import { DemoUpgradePrompt } from "@/components/DemoUpgradePrompt";

export default function DemoFinancialSimulator() {
  const navigate = useNavigate();
  const { incrementEventCount, setDemoData, getDemoData } = useGuestSession();
  
  // Verificar si hay análisis de IA previo
  const [revenue, setRevenue] = useState('');
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCosts, setVariableCosts] = useState('');
  const [hasAiData, setHasAiData] = useState(false);

  // Pre-llenar SOLO si hay datos de IA
  useEffect(() => {
    const aiAnalysis = localStorage.getItem('ai_analysis');
    if (aiAnalysis) {
      try {
        const analysis = JSON.parse(aiAnalysis);
        setHasAiData(true);
        // Pre-llenar con sugerencias de IA (solo si existen)
        if (analysis.proyeccion_financiera?.ticket_promedio?.max) {
          setRevenue(String(analysis.proyeccion_financiera.ticket_promedio.max));
        }
        if (analysis.proyeccion_financiera?.costos_fijos_mensuales?.valor) {
          setFixedCosts(String(analysis.proyeccion_financiera.costos_fijos_mensuales.valor));
        }
      } catch (error) {
        console.error('Error parsing AI analysis:', error);
      }
    }
    // Si NO hay análisis, dejar TODO vacío
  }, []);

  // Guardar datos cuando cambien
  useEffect(() => {
    if (revenue) setDemoData('simulator_revenue', Number(revenue));
    if (fixedCosts) setDemoData('simulator_fixedCosts', Number(fixedCosts));
    if (variableCosts) setDemoData('simulator_variableCosts', Number(variableCosts));
  }, [revenue, fixedCosts, variableCosts, setDemoData]);

  const handleInputChange = (value: string, field: string) => {
    incrementEventCount();
    if (field === 'revenue') setRevenue(value);
    if (field === 'fixedCosts') setFixedCosts(value);
    if (field === 'variableCosts') setVariableCosts(value);
  };

  // Calcular solo si hay valores
  const numRevenue = Number(revenue) || 0;
  const numFixedCosts = Number(fixedCosts) || 0;
  const numVariableCosts = Number(variableCosts) || 0;
  
  const canCalculate = revenue && fixedCosts && variableCosts && numRevenue > 0;
  
  const profit = numRevenue - numFixedCosts - numVariableCosts;
  const profitMargin = numRevenue > 0 ? ((profit / numRevenue) * 100).toFixed(1) : 0;
  
  // Calcular punto de equilibrio correctamente
  const contributionMargin = numRevenue > 0 ? numRevenue - numVariableCosts : 0;
  const contributionMarginRate = numRevenue > 0 ? contributionMargin / numRevenue : 0;
  const breakEvenRevenue = contributionMarginRate > 0 ? numFixedCosts / contributionMarginRate : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-2.5 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Proyecto Emprendedurismo
            </span>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/auth')}
            className="border-2"
          >
            Crear Cuenta
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Banner Demo */}
        <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            MODO DEMO - Los cambios no se guardan permanentemente.
          </AlertDescription>
        </Alert>
        
        {/* Info si hay datos de IA */}
        {hasAiData && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Hemos pre-llenado algunos campos con datos del análisis de IA. 
              Podés modificarlos libremente.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Simulador Financiero
          </h1>
          <p className="text-lg text-muted-foreground">
            Jugá con los números para ver cuánta plata podés ganar
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Tus números</CardTitle>
                <CardDescription>
                  Cambiá los valores para ver qué pasa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenue">
                    ¿Cuánto vendés por mes?
                  </Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={revenue}
                    onChange={(e) => handleInputChange(e.target.value, 'revenue')}
                    placeholder="Ej: 2500000"
                    className="text-lg"
                  />
                  {revenue && (
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(Number(revenue))}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixedCosts">
                    Gastos fijos (alquiler, servicios, sueldos)
                  </Label>
                  <Input
                    id="fixedCosts"
                    type="number"
                    value={fixedCosts}
                    onChange={(e) => handleInputChange(e.target.value, 'fixedCosts')}
                    placeholder="Ej: 745000"
                    className="text-lg"
                  />
                  {fixedCosts && (
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(Number(fixedCosts))}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variableCosts">
                    Gastos variables (mercadería, insumos)
                  </Label>
                  <Input
                    id="variableCosts"
                    type="number"
                    value={variableCosts}
                    onChange={(e) => handleInputChange(e.target.value, 'variableCosts')}
                    placeholder="Ej: 1050000"
                    className="text-lg"
                  />
                  {variableCosts && (
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(Number(variableCosts))}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="space-y-6">
            <Card className="border-2 bg-gradient-to-br from-green-500/10 to-blue-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Tu ganancia mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                {canCalculate ? (
                  <>
                    <p className="text-4xl font-bold mb-2">
                      {formatCurrency(profit)}
                    </p>
                    <Badge variant={profit > 0 ? "default" : "destructive"}>
                      Margen: {profitMargin}%
                    </Badge>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Completa todos los campos para ver tu ganancia
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Punto de equilibrio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {canCalculate && numRevenue > 0 && numVariableCosts < numRevenue ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tenés que vender por lo menos:
                    </p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(breakEvenRevenue)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Fórmula: Costos Fijos ÷ (1 − Costos Variables ÷ Ingresos)
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {!canCalculate 
                      ? "Completa todos los campos para ver el punto de equilibrio"
                      : numRevenue === 0 
                        ? "Ingresá un valor de ingresos mayor a 0"
                        : "Los costos variables no pueden ser mayores o iguales a los ingresos"}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle>Desglose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canCalculate ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ventas:</span>
                      <span className="font-semibold">{formatCurrency(numRevenue)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Gastos fijos:</span>
                      <span className="font-semibold">-{formatCurrency(numFixedCosts)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Gastos variables:</span>
                      <span className="font-semibold">-{formatCurrency(numVariableCosts)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg">
                      <span className="font-semibold">Te queda:</span>
                      <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(profit)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Completa todos los campos para ver el desglose
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
            size="lg"
          >
            ← Volver al Dashboard
          </Button>
          <Button
            onClick={() => navigate('/demo/emprendedor/dashboard')}
            size="lg"
            disabled={!canCalculate}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Continuar al Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
}
