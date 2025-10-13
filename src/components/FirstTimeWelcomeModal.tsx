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
import { Sparkles } from "lucide-react";

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
      }, 500);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary rounded-full p-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            🤖 ¡Bienvenido! Antes de empezar...
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-4 space-y-4">
            <p>
              Para darte <span className="font-semibold text-foreground">recomendaciones personalizadas</span>, 
              necesito conocer tu idea de negocio.
            </p>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Nuestro validador de ideas te ayudará a entender el potencial de tu negocio 
                y te dará insights valiosos basados en IA.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleValidateIdea}
            variant="gradient"
            size="lg"
            className="w-full"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Validar mi Idea de Negocio
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="sm"
          >
            Lo haré después
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
