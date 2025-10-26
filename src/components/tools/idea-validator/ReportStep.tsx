import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Download, Share2, RefreshCw, TrendingUp, DollarSign, Clock } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface ValidationReport {
  score: number;
  marketSize: string;
  growth: string;
  competition: string;
  strengths: string[];
  risks: string[];
  investment: string;
  timeToLaunch: string;
  nextSteps: string[];
  factors: {
    market: number;
    competition: number;
    viability: number;
    profitability: number;
    scalability: number;
    differentiation: number;
  };
}

interface IdeaData {
  title: string;
  description: string;
}

interface ReportStepProps {
  report: ValidationReport;
  ideaData: IdeaData;
  onReset: () => void;
}

export function ReportStep({ report, ideaData, onReset }: ReportStepProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[hsl(var(--success))]";
    if (score >= 60) return "text-[hsl(var(--accent-orange))]";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Alta Viabilidad";
    if (score >= 60) return "Viabilidad Media";
    return "Viabilidad Baja";
  };

  const radarData = [
    { category: "Mercado", value: report.factors.market },
    { category: "Competencia", value: report.factors.competition },
    { category: "Viabilidad", value: report.factors.viability },
    { category: "Rentabilidad", value: report.factors.profitability },
    { category: "Escalabilidad", value: report.factors.scalability },
    { category: "Diferenciación", value: report.factors.differentiation },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Reporte de Validación</h1>
            <p className="text-lg text-muted-foreground">{ideaData.title}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Puntaje de Viabilidad</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-6xl font-bold ${getScoreColor(report.score)}`}>
                    {report.score}
                  </span>
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
                <Badge className="mt-3" variant="secondary">
                  {getScoreLabel(report.score)}
                </Badge>
              </div>
              <div className="h-48 w-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Factores"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Analysis */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-[hsl(var(--business))] mb-2" />
              <CardTitle>Tamaño del Mercado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{report.marketSize}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-[hsl(var(--success))] mb-2" />
              <CardTitle>Crecimiento Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{report.growth}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-[hsl(var(--accent-orange))] mb-2" />
              <CardTitle>Nivel de Competencia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{report.competition}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Strengths and Risks */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                Fortalezas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--accent-orange))]" />
                Riesgos a Considerar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {report.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-[hsl(var(--accent-orange))] flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Investment and Time */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--pyme))] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Inversión Estimada</p>
                  <p className="text-2xl font-bold">{report.investment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-[hsl(var(--business))] to-[hsl(var(--success))] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Tiempo al Lanzamiento</p>
                  <p className="text-2xl font-bold">{report.timeToLaunch}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Próximos Pasos Recomendados</CardTitle>
            <CardDescription>Plan de acción para validar y lanzar tu idea</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {report.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button onClick={onReset} variant="outline" size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Validar otra idea
        </Button>
        <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--pyme))]">
          Crear Plan de Negocio
        </Button>
      </div>
    </div>
  );
}
