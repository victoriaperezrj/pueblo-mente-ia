import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, TrendingUp, Users, DollarSign, Target, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react";
import { NavigationButtons } from "@/components/NavigationButtons";

export default function DemoResults() {
  const navigate = useNavigate();
  const [demoData, setDemoData] = useState<any>(null);
  const [ideaData, setIdeaData] = useState<any>(null);

  useEffect(() => {
    const result = localStorage.getItem('demo_result');
    const idea = localStorage.getItem('demo_idea');
    
    if (!result || !idea) {
      navigate('/demo/intro');
      return;
    }
    
    setDemoData(JSON.parse(result));
    setIdeaData(JSON.parse(idea));
  }, [navigate]);

  if (!demoData || !ideaData) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Banner Demo */}
        <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            MODO DEMO - Estos son datos de ejemplo. 
            <Button 
              variant="link" 
              onClick={() => navigate('/auth')}
              className="p-0 h-auto ml-1 text-yellow-700 dark:text-yellow-400"
            >
              Crear cuenta
            </Button> 
            {" "}para analizar tu idea de verdad.
          </AlertDescription>
        </Alert>

        {/* Título */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-green-600 hover:bg-green-700">
            IDEA VIABLE
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Análisis de tu Idea
          </h1>
          <p className="text-lg text-muted-foreground">
            {ideaData.industry} en {ideaData.location}
          </p>
        </div>

        {/* Cards principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Plata para arrancar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(demoData.investment_range.min)} - {formatCurrency(demoData.investment_range.max)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Inversión inicial estimada
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Podés ganar por mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(demoData.monthly_revenue)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Ingresos mensuales estimados
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Recuperás inversión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {demoData.breakeven_months} meses
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Tiempo para recuperar plata
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Competencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {demoData.competitors_count} competidores
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                En tu zona
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-pink-600" />
                Clientes potenciales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {demoData.market_size.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Personas en tu mercado
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Tu diferenciador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">
                {demoData.suggested_niche}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Oportunidades y Riesgos */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Lightbulb className="h-5 w-5" />
                Oportunidades
              </CardTitle>
              <CardDescription>
                Lo que podés aprovechar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {demoData.opportunities.map((opp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-sm">{opp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-5 w-5" />
                Cosas a tener en cuenta
              </CardTitle>
              <CardDescription>
                Desafíos que vas a enfrentar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {demoData.risks.map((risk: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">!</span>
                    <span className="text-sm">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recomendaciones */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Te recomendamos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {demoData.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <span className="font-bold text-primary">{idx + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <NavigationButtons
          onBack={() => navigate('/demo/idea-capture')}
          onNext={() => navigate('/demo/financial-simulator')}
          nextLabel="Ver Simulador Financiero"
          backLabel="Cambiar mi Idea"
        />
        
        <div className="text-center mt-6">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90"
            onClick={() => navigate('/auth')}
          >
            Crear Cuenta Gratis 🚀
          </Button>
        </div>
      </div>
    </div>
  );
}
