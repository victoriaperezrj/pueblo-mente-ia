import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  MapPin, 
  FileText, 
  Target,
  ArrowLeft,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface ValidationResult {
  viability: 'viable' | 'caution' | 'risky';
  investment_range: {
    min: number;
    max: number;
  };
  monthly_revenue: {
    pessimistic: number;
    realistic: number;
    optimistic: number;
  };
  competitors_count: number;
  market_size: number;
  suggested_niche: string;
  key_factors: string[];
  warnings: string[];
  opportunities: string[];
  timeframe: {
    setup_months: number;
    break_even_months: number;
  };
}

interface BusinessIdea {
  id: string;
  industry: string;
  location: string;
  idea_description: string;
  validation_result: ValidationResult;
  user_id: string;
}

const EntrepreneurResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [idea, setIdea] = useState<BusinessIdea | null>(null);

  useEffect(() => {
    const loadIdea = async () => {
      const ideaId = searchParams.get('ideaId');
      
      if (!ideaId) {
        toast({
          title: "Error",
          description: "No se encontró el ID de la idea",
          variant: "destructive"
        });
        navigate('/onboarding/entrepreneur/step1');
        return;
      }

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
          description: "No se pudo cargar tu idea",
          variant: "destructive"
        });
        navigate('/onboarding/entrepreneur/step1');
        return;
      }

      if (!data.validation_result) {
        navigate(`/onboarding/entrepreneur/analyzing?ideaId=${ideaId}`);
        return;
      }

      setIdea(data as unknown as BusinessIdea);
      setLoading(false);
    };

    loadIdea();
  }, [searchParams, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!idea) return null;

  const result = idea.validation_result;
  
  const viabilityConfig = {
    viable: {
      color: "bg-green-500",
      badge: "🟢 TU IDEA ES VIABLE",
      title: "Tu idea tiene alto potencial",
      variant: "default" as const
    },
    caution: {
      color: "bg-yellow-500",
      badge: "🟡 VIABLE CON AJUSTES",
      title: "Idea prometedora, con recomendaciones",
      variant: "secondary" as const
    },
    risky: {
      color: "bg-orange-500",
      badge: "🟠 REQUIERE ANÁLISIS PROFUNDO",
      title: "Necesita planificación cuidadosa",
      variant: "destructive" as const
    }
  };

  const config = viabilityConfig[result.viability];

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num);
  };

  const investmentBreakdown = [
    { label: "Equipamiento", percent: 40 },
    { label: "Habilitaciones", percent: 15 },
    { label: "Capital de trabajo", percent: 35 },
    { label: "Marketing inicial", percent: 10 }
  ];

  const permits = [
    "AFIP Monotributo",
    "Habilitación Bromatológica", 
    "ARBA Ingresos Brutos",
    "Matrícula Municipal"
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-6xl mx-auto space-y-6 py-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Análisis: {idea.industry} en {idea.location}</h1>
            <p className="text-sm text-muted-foreground">{idea.idea_description}</p>
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
              Analizamos tu idea con datos del mercado en {idea.location}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* TARJETA 1: INVERSIÓN INICIAL */}
          <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <DollarSign className="w-6 h-6" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  Plata que necesitás para arrancar
                </CardTitle>
                <p className="text-2xl font-bold">
                  {formatCurrency(result.investment_range.min)} - {formatCurrency(result.investment_range.max)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {investmentBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{item.percent}%</span>
                  </div>
                  <Progress value={item.percent} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* TARJETA 2: REVENUE PROYECTADO */}
          <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  Cuánta plata vas a ganar por mes
                </CardTitle>
                <p className="text-2xl font-bold">
                  {formatCurrency(result.monthly_revenue.realistic)}/mes
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pesimista</span>
                  <span>{formatCurrency(result.monthly_revenue.pessimistic)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Realista</span>
                  <span className="font-semibold">{formatCurrency(result.monthly_revenue.realistic)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Optimista</span>
                  <span>{formatCurrency(result.monthly_revenue.optimistic)}</span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Recuperás tu inversión en: {result.timeframe.break_even_months} meses
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* TARJETA 3: COMPETENCIA */}
          <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  Cuántos negocios parecidos hay
                </CardTitle>
                <p className="text-2xl font-bold">
                  {result.competitors_count} negocios similares
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {result.competitors_count < 3 
                  ? "Baja saturación detectada en la zona" 
                  : "Mercado con competencia moderada"}
              </p>
              {result.competitors_count < 3 && (
                <Badge variant="default" className="bg-green-500">
                  Demanda no saturada
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* TARJETA 4: MERCADO */}
          <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  Tamaño del Mercado
                </CardTitle>
                <p className="text-2xl font-bold">
                  {formatNumber(result.market_size)} habitantes
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">Población local en {idea.location}</p>
                <p className="font-medium">Poder adquisitivo: Medio-Alto</p>
              </div>
            </CardContent>
          </Card>

          {/* TARJETA 5: REGULACIONES */}
          <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  Permisos Requeridos
                </CardTitle>
                <p className="text-2xl font-bold">
                  {permits.length} habilitaciones necesarias
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {permits.map((permit, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox id={`permit-${i}`} disabled />
                    <label htmlFor={`permit-${i}`} className="text-sm text-muted-foreground cursor-pointer">
                      {permit}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TARJETA 6: NICHO SUGERIDO */}
          <Card className="hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group border-2">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                  <Target className="w-6 h-6" />
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  Tu Oportunidad
                </CardTitle>
                <p className="text-xl font-bold">
                  {result.suggested_niche}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Este nicho tiene alta demanda y baja competencia en {idea.location}. 
                Diferenciarte aquí aumenta tus probabilidades de éxito significativamente.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PRÓXIMOS PASOS */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">Próximos Pasos</CardTitle>
            <CardDescription>Continúa desarrollando tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="step1" />
              <label htmlFor="step1" className="text-sm font-medium cursor-pointer">
                Revisar todo el Plan paso a paso
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="step2" />
              <label htmlFor="step2" className="text-sm font-medium cursor-pointer">
                Calcular cuánta plata necesito
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="step3" />
              <label htmlFor="step3" className="text-sm font-medium cursor-pointer">
                Ver proveedores recomendados
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="step4" />
              <label htmlFor="step4" className="text-sm font-medium cursor-pointer">
                Hacer trámites que necesito
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            size="lg"
            variant="default"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate('/business-blueprint')}
          >
            Ver Plan Completo →
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-2 hover:bg-muted"
            onClick={() => navigate('/onboarding/entrepreneur/step1')}
          >
            Cambiar mi Idea
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-2 hover:bg-muted"
            onClick={() => navigate('/financial-simulator')}
          >
            Calcular Finanzas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurResults;
