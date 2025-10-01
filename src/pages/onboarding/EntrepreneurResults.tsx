import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  MapPin, 
  FileText, 
  Target,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const EntrepreneurResults = () => {
  const navigate = useNavigate();

  // Datos simulados - después integraremos IA real
  const viabilityScore = "VIABLE"; // "VIABLE" | "VIABLE_WITH_ADJUSTMENTS" | "RISKY"
  
  const viabilityConfig = {
    VIABLE: {
      color: "bg-green-500",
      badge: "🟢 VIABLE",
      title: "Tu idea tiene alto potencial",
      variant: "default" as const
    },
    VIABLE_WITH_ADJUSTMENTS: {
      color: "bg-yellow-500",
      badge: "🟡 VIABLE CON AJUSTES",
      title: "Idea prometedora, con recomendaciones",
      variant: "secondary" as const
    },
    RISKY: {
      color: "bg-red-500",
      badge: "🔴 RIESGOSA",
      title: "Requiere análisis más profundo",
      variant: "destructive" as const
    }
  };

  const config = viabilityConfig[viabilityScore];

  const metrics = [
    {
      icon: DollarSign,
      title: "Inversión Inicial",
      value: "$8M - $15M ARS",
      description: "Equipamiento, Habilitaciones, Capital de trabajo",
      color: "text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Revenue Proyectado",
      value: "$2.5M/mes",
      description: "Break-even en 8 meses",
      color: "text-green-500"
    },
    {
      icon: Users,
      title: "Competencia",
      value: "2 negocios similares",
      description: "Panadería Don José, Pan y Más",
      color: "text-orange-500"
    },
    {
      icon: MapPin,
      title: "Mercado",
      value: "12,000 habitantes",
      description: "Alta demanda detectada",
      color: "text-purple-500"
    },
    {
      icon: FileText,
      title: "Regulaciones",
      value: "4 habilitaciones",
      description: "Ver checklist completo →",
      color: "text-red-500"
    },
    {
      icon: Target,
      title: "Nicho Sugerido",
      value: "Pan artesanal + Sin TACC",
      description: "Diferenciación en productos especiales",
      color: "text-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-6xl mx-auto space-y-6 py-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/onboarding/entrepreneur/step1')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Resultados de Validación</h1>
            <p className="text-sm text-muted-foreground">Análisis completo de tu idea de negocio</p>
          </div>
        </div>

        <Card className="border-2 overflow-hidden">
          <div className={`h-2 ${config.color}`} />
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="flex justify-center">
              <Badge variant={config.variant} className="text-lg py-2 px-4">
                {config.badge}
              </Badge>
            </div>
            <CardTitle className="text-3xl">{config.title}</CardTitle>
            <CardDescription className="text-base">
              Analizamos tu idea con datos reales del mercado en San Luis
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <Card 
              key={index}
              className="hover:scale-105 hover:shadow-2xl transition-all duration-300 group border-2"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-background/50 ${metric.color}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                    {metric.title}
                  </CardTitle>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={() => navigate('/business-blueprint')}
          >
            Ver Plan de Negocio Completo →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/onboarding/entrepreneur/step1')}
          >
            Ajustar mi Idea
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurResults;
