import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Sparkles, Target, Users, DollarSign, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { IdeaValidatorWizard } from "@/components/IdeaValidatorWizard";

interface ValidationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  marketSize: string;
  competition: string;
  recommendation: string;
  nextSteps: string[];
}

const IdeaValidator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleWizardComplete = async (formData: any) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-idea', {
        body: {
          businessIdea: formData.idea,
          targetMarket: formData.targetCustomer,
          problem: formData.problem || formData.idea,
          solution: formData.idea,
          budget: formData.budget,
          revenueModel: formData.revenue
        }
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data received from AI');
      }

      setResult(data as ValidationResult);
      
      toast({
        title: "✓ Análisis completo",
        description: "Tu idea ha sido evaluada por nuestra IA",
      });
    } catch (error: any) {
      console.error('Validation error:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo completar el análisis. Intentá de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <div className="bg-gradient-primary rounded-xl p-2.5">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          Validador de Ideas 💡
        </h1>
        <p className="text-muted-foreground mt-2">
          Analizá el potencial de tu negocio con inteligencia artificial
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold">¡Bienvenido al Validador de Ideas!</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Te guiaremos paso a paso para analizar tu idea de negocio con inteligencia artificial.
                  Solo tomará <span className="font-semibold text-foreground">10 minutos</span> y obtendrás un análisis completo.
                </p>
              </div>
            </CardContent>
          </Card>

          <IdeaValidatorWizard onComplete={handleWizardComplete} loading={loading} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score Card */}
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 overflow-hidden">
            <div className="h-1 bg-gradient-hero" />
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-primary">
                  <div className="text-5xl font-bold text-white">
                    {result.score}
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Puntuación de Viabilidad</h2>
                  <Progress value={result.score} className="h-3 max-w-md mx-auto" />
                  <p className="text-sm text-muted-foreground mt-3">
                    {result.score >= 70 ? "✅ Buena viabilidad" : result.score >= 50 ? "⚠️ Viable con ajustes" : "❌ Alta incertidumbre"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-2 border-success/30 overflow-hidden">
            <div className="h-1 bg-gradient-success" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-success rounded-lg p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                Recomendación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{result.recommendation}</p>
            </CardContent>
          </Card>

          {/* FODA Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-success/30 overflow-hidden">
              <div className="h-1 bg-gradient-success" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Fortalezas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-warning/30 overflow-hidden">
              <div className="h-1 bg-gradient-warm" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingDown className="h-5 w-5 text-warning" />
                  Debilidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/30 overflow-hidden">
              <div className="h-1 bg-gradient-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.opportunities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-destructive/30 overflow-hidden">
              <div className="h-1 bg-gradient-warm" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Amenazas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.threats.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 overflow-hidden">
              <div className="h-1 bg-gradient-primary" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Tamaño del Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.marketSize}</p>
              </CardContent>
            </Card>

            <Card className="border-2 overflow-hidden">
              <div className="h-1 bg-gradient-warm" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Análisis de Competencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.competition}</p>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="border-2 border-accent/30 overflow-hidden">
            <div className="h-1 bg-gradient-hero" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-primary rounded-lg p-2">
                  <Target className="h-5 w-5 text-white" />
                </div>
                Próximos Pasos Recomendados
              </CardTitle>
              <CardDescription>
                Plan de acción sugerido por la IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {result.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Badge variant="secondary" className="text-base px-2.5 py-1 flex-shrink-0">
                      {idx + 1}
                    </Badge>
                    <span className="text-sm pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button variant="gradient" size="lg" onClick={resetForm}>
              <Lightbulb className="mr-2 h-5 w-5" />
              Validar Otra Idea
            </Button>
            <Button variant="outline" size="lg">
              <Target className="mr-2 h-5 w-5" />
              Crear Plan de Negocio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaValidator;
