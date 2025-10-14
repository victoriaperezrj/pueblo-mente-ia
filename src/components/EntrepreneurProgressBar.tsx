import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  current?: boolean;
}

interface EntrepreneurProgressBarProps {
  currentPhase: string;
  overallProgress: number;
  steps: ProgressStep[];
}

export function EntrepreneurProgressBar({ 
  currentPhase, 
  overallProgress, 
  steps 
}: EntrepreneurProgressBarProps) {
  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardContent className="pt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">📍 Estás en: {currentPhase}</h3>
            <span className="text-sm font-medium text-primary">{overallProgress}% completado</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">Próximos pasos recomendados:</p>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div 
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  step.current ? 'bg-primary/10 border-l-4 border-primary' : ''
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                ) : step.current ? (
                  <Loader2 className="h-5 w-5 text-primary flex-shrink-0 animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${step.completed ? 'line-through text-muted-foreground' : step.current ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                  {idx + 1}. {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}