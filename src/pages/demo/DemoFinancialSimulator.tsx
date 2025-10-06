import { useState } from "react";
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

export default function DemoFinancialSimulator() {
  const navigate = useNavigate();
  const [revenue, setRevenue] = useState(2500000);
  const [fixedCosts, setFixedCosts] = useState(745000);
  const [variableCosts, setVariableCosts] = useState(1050000);

  const profit = revenue - fixedCosts - variableCosts;
  const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
  
  // Calcular punto de equilibrio correctamente
  const contributionMargin = revenue > 0 ? revenue - variableCosts : 0;
  const contributionMarginRate = revenue > 0 ? contributionMargin / revenue : 0;
  const breakEvenRevenue = contributionMarginRate > 0 ? fixedCosts / contributionMarginRate : 0;

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
            MODO DEMO - Los cambios no se guardan. 
            <Button 
              variant="link" 
              onClick={() => navigate('/auth')}
              className="p-0 h-auto ml-1 text-yellow-700 dark:text-yellow-400"
            >
              Crear cuenta
            </Button> 
            {" "}para guardar tus simulaciones.
          </AlertDescription>
        </Alert>

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
                    onChange={(e) => setRevenue(Number(e.target.value))}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(revenue)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixedCosts">
                    Gastos fijos (alquiler, servicios, sueldos)
                  </Label>
                  <Input
                    id="fixedCosts"
                    type="number"
                    value={fixedCosts}
                    onChange={(e) => setFixedCosts(Number(e.target.value))}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(fixedCosts)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variableCosts">
                    Gastos variables (mercadería, insumos)
                  </Label>
                  <Input
                    id="variableCosts"
                    type="number"
                    value={variableCosts}
                    onChange={(e) => setVariableCosts(Number(e.target.value))}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(variableCosts)}
                  </p>
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
                <p className="text-4xl font-bold mb-2">
                  {formatCurrency(profit)}
                </p>
                <Badge variant={profit > 0 ? "default" : "destructive"}>
                  Margen: {profitMargin}%
                </Badge>
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
                {revenue > 0 && variableCosts < revenue ? (
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
                  <Alert variant="destructive">
                    <AlertDescription>
                      {revenue === 0 
                        ? "Ingresá un valor de ingresos mayor a 0 para calcular el punto de equilibrio"
                        : "Los costos variables no pueden ser mayores o iguales a los ingresos"}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 bg-primary/5">
              <CardHeader>
                <CardTitle>Desglose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ventas:</span>
                  <span className="font-semibold">{formatCurrency(revenue)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Gastos fijos:</span>
                  <span className="font-semibold">-{formatCurrency(fixedCosts)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Gastos variables:</span>
                  <span className="font-semibold">-{formatCurrency(variableCosts)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-semibold">Te queda:</span>
                  <span className={`font-bold ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DemoBottomBar
          onBack={() => navigate('/demo/results')}
          onNext={() => navigate('/auth')}
          nextLabel="Crear Cuenta Gratis 🚀"
          backLabel="← ANTERIOR PASO"
          hideSkip
        />
      </div>
    </div>
  );
}
