import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";
import { demoIdeaResult } from "@/utils/demoData";

export default function DemoAnalyzing() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analizando tu idea...",
    "Buscando competidores en la zona...",
    "Calculando inversión necesaria...",
    "Estimando ingresos posibles...",
    "Identificando oportunidades...",
    "Preparando tu análisis completo..."
  ];

  useEffect(() => {
    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 150);

    // Cambiar mensajes
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    // Navegar a resultados después de 10 segundos
    const timeout = setTimeout(() => {
      localStorage.setItem('demo_result', JSON.stringify(demoIdeaResult));
      navigate('/demo/results');
    }, 10000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

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

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center border-2 shadow-xl">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-primary" />
          
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Analizando tu idea
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            {steps[currentStep]}
          </p>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {progress}% completado
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            Esto toma unos segundos...
          </p>
          
          <div className="mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate('/demo/idea-capture')}
              className="w-full border-2"
            >
              Cancelar y Volver
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
