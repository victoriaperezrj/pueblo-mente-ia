import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface ProgressWidgetProps {
  overallProgress: number;
  planProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  regulationsProgress: {
    completed: number;
    total: number;
  };
  onContinue: () => void;
}

export default function ProgressWidget({
  overallProgress,
  planProgress,
  regulationsProgress,
  onContinue
}: ProgressWidgetProps) {
  const stages = [
    { name: 'Validación', completed: true },
    { name: 'Planificación', completed: planProgress.percentage > 0, active: true },
    { name: 'Setup', completed: false },
    { name: 'Lanzamiento', completed: false }
  ];

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardTitle className="text-2xl">Tu Progreso hacia el Lanzamiento</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Circular Progress */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                  opacity="0.2"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-primary"
                  strokeDasharray={`${overallProgress * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{overallProgress}%</span>
                <span className="text-sm text-muted-foreground">completado</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Idea validada
                </span>
                <span className="font-semibold">✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
                  Plan de negocio
                </span>
                <span className="font-semibold">{planProgress.percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Simulación financiera
                </span>
                <span className="font-semibold">✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  Regulaciones
                </span>
                <span className="font-semibold">{regulationsProgress.completed}/{regulationsProgress.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  Proveedores contactados
                </span>
                <span className="font-semibold">3/8</span>
              </div>
            </div>
          </div>

          {/* Right: Timeline and Actions */}
          <div className="flex flex-col justify-between">
            {/* Timeline */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="flex flex-col items-center flex-1">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                      ${stage.completed 
                        ? 'bg-green-500 text-white' 
                        : stage.active 
                        ? 'bg-primary text-primary-foreground animate-pulse' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}>
                      {stage.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : stage.active ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </div>
                    <span className={`text-xs text-center ${stage.active ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {stage.name}
                    </span>
                    {index < stages.length - 1 && (
                      <div className={`
                        absolute h-0.5 w-16 mt-6
                        ${stage.completed ? 'bg-green-500' : 'bg-muted'}
                      `} style={{ left: `${(index + 1) * 25}%` }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Próximo Paso</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Continuá con tu plan de negocio. Tenés {planProgress.total - planProgress.completed} tareas pendientes.
              </p>
              <Button onClick={onContinue} className="w-full">
                Continuar Plan de Negocio →
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
