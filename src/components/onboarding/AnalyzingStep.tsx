import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useToast } from "@/hooks/use-toast";

type Stage = "entrepreneur" | "business" | "pyme_enterprise";

interface AnalyzingStepProps {
  stage: Stage;
  formData: Record<string, string>;
}

export function AnalyzingStep({ stage, formData }: AnalyzingStepProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { saveOnboardingData, completeOnboarding } = useOnboarding();
  const { toast } = useToast();

  const steps = [
    "Identificando tu etapa",
    "Buscando herramientas clave",
    "Armando tu plan personalizado",
    "Configurando tu dashboard",
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
    }, 30);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 750);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // Save data and complete onboarding
      const completeProcess = async () => {
        try {
          await saveOnboardingData({ stage, ...formData });
          await completeOnboarding(stage);
          
          setTimeout(() => {
            toast({
              title: "¡Todo listo!",
              description: "Tu cuenta ha sido configurada exitosamente",
            });
            navigate("/dashboard");
          }, 1000);
        } catch (error) {
          console.error("Error completing onboarding:", error);
          toast({
            title: "Error",
            description: "Hubo un problema al configurar tu cuenta",
            variant: "destructive",
          });
        }
      };

      completeProcess();
    }
  }, [progress]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-white/95 dark:bg-white/10 backdrop-blur-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--pyme))] flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Analizando tu perfil</h2>
            <p className="text-muted-foreground">
              Estamos preparando todo para vos. Esto tomará solo unos segundos...
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

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
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
