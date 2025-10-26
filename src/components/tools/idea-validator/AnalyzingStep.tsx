import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";

interface IdeaData {
  title: string;
  description: string;
}

interface AnalyzingStepProps {
  ideaData: IdeaData;
}

export function AnalyzingStep({ ideaData }: AnalyzingStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analizando mercado objetivo",
    "Evaluando competencia",
    "Calculando viabilidad financiera",
    "Generando recomendaciones",
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--pyme))] flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Analizando tu idea</h2>
              <p className="text-muted-foreground">
                Estamos procesando la información. Esto tomará unos segundos...
              </p>
            </div>

            {/* Idea Summary */}
            <Card className="mb-8 bg-muted/30">
              <CardContent className="p-4">
                <p className="font-semibold mb-1">{ideaData.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ideaData.description}
                </p>
              </CardContent>
            </Card>

            {/* Progress Bar */}
            <div className="space-y-2 mb-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progreso del análisis</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center gap-3"
                >
                  {index < currentStep ? (
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--success))] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : index === currentStep ? (
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center flex-shrink-0">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm ${
                      index <= currentStep
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
