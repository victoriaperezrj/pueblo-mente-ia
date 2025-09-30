import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Loader2, Sparkles, Target, Users, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  // Form state
  const [businessIdea, setBusinessIdea] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [budget, setBudget] = useState("");

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: ValidationResult = {
        score: 78,
        strengths: [
          "Mercado local con demanda comprobada",
          "Baja barrera de entrada inicial",
          "Posibilidad de diferenciación por servicio personalizado",
          "Tendencia creciente en San Luis"
        ],
        weaknesses: [
          "Alta competencia en el rubro",
          "Márgenes de ganancia ajustados",
          "Dependencia de proveedores locales",
          "Requiere inversión en marketing inicial"
        ],
        opportunities: [
          "Expansión a delivery y pedidos online",
          "Alianzas con comercios cercanos",
          "Servicios corporativos y eventos",
          "Programa de fidelización digital"
        ],
        threats: [
          "Competidores establecidos con marca fuerte",
          "Fluctuaciones en costos de insumos",
          "Cambios en hábitos de consumo",
          "Regulaciones sanitarias más estrictas"
        ],
        marketSize: "Mercado local estimado en $2.5M anuales, con crecimiento del 15% anual",
        competition: "Competencia media-alta. Existen 8-12 negocios similares en la zona, pero hay espacio para diferenciación.",
        recommendation: "✅ IDEA VIABLE - Tu concepto tiene potencial en el mercado de San Luis. Recomendamos validar con un MVP (Producto Mínimo Viable) antes de invertir fuertemente.",
        nextSteps: [
          "Hacer encuestas a 50+ clientes potenciales",
          "Analizar precios de 3-5 competidores directos",
          "Calcular costos exactos de operación mensual",
          "Crear prototipo o prueba piloto de 30 días",
          "Definir propuesta de valor única"
        ]
      };

      setResult(mockResult);
      setLoading(false);
      
      toast({
        title: "✓ Análisis completo",
        description: "Tu idea ha sido evaluada por nuestra IA",
      });
    }, 3000);
  };

  const resetForm = () => {
    setBusinessIdea("");
    setTargetMarket("");
    setProblem("");
    setSolution("");
    setBudget("");
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
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
        <form onSubmit={handleValidate} className="space-y-6">
          <Card className="border-2 overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="h-1 bg-gradient-hero" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-gradient-primary rounded-lg p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                Contanos tu idea
              </CardTitle>
              <CardDescription>
                Completá el formulario con la mayor información posible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessIdea">¿Cuál es tu idea de negocio? *</Label>
                <Textarea
                  id="businessIdea"
                  placeholder="Ej: Panadería artesanal con productos sin gluten y veganos, enfocada en delivery..."
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  required
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Mercado objetivo *</Label>
                  <Input
                    id="targetMarket"
                    placeholder="Ej: Familias de San Luis Capital, 25-45 años"
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto estimado</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Ej: 500000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem">¿Qué problema resuelve? *</Label>
                <Textarea
                  id="problem"
                  placeholder="Ej: Dificultad para conseguir productos frescos sin gluten en San Luis..."
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">¿Cuál es tu solución? *</Label>
                <Textarea
                  id="solution"
                  placeholder="Ej: Ofrecer variedad de productos horneados frescos diariamente con delivery rápido..."
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>
                    Cuanta más información nos des, más preciso será el análisis. La IA evaluará 
                    viabilidad, competencia, mercado y rentabilidad.
                  </span>
                </p>
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
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Validar mi Idea
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
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
