import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb, Sparkles, Target, TrendingUp, Users } from "lucide-react";

export function FirstTimeWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    
    if (!hasSeenWelcome) {
      // Show modal after a short delay
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleValidateIdea = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setIsOpen(false);
    navigate("/idea-validator");
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenWelcomeModal", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary rounded-full p-4 animate-pulse">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            🤖 ¡Bienvenido! Antes de empezar...
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Para darte recomendaciones personalizadas, necesito conocer tu idea de negocio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <p className="text-sm text-muted-foreground text-center">
            Con el Validador de Ideas descubrirás:
          </p>
          
          <div className="grid gap-3">
            <Card className="p-3 border-2 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-primary rounded-lg p-2 flex-shrink-0">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">¿Tu idea puede funcionar?</p>
                  <p className="text-muted-foreground text-xs">Análisis de viabilidad con IA</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 border-2 hover:border-success/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-success rounded-lg p-2 flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Oportunidades y riesgos</p>
                  <p className="text-muted-foreground text-xs">Fortalezas, debilidades y amenazas</p>
                </div>
              </div>
            </Card>

            <Card className="p-3 border-2 hover:border-warning/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-warm rounded-lg p-2 flex-shrink-0">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Tu mercado objetivo</p>
                  <p className="text-muted-foreground text-xs">Tamaño del mercado y competencia</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
            <p className="text-xs text-center text-muted-foreground">
              ⏱️ Solo toma <span className="font-semibold text-foreground">10 minutos</span> y es completamente <span className="font-semibold text-foreground">gratis</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleValidateIdea}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <Lightbulb className="mr-2 h-5 w-5" />
            Validar mi Idea de Negocio
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full"
          >
            Explorar sin validar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
