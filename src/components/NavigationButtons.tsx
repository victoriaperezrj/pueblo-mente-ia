import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  hideNext?: boolean;
  hideBack?: boolean;
  hideSkip?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export function NavigationButtons({
  onBack,
  onNext,
  onSkip,
  nextLabel = "Siguiente",
  backLabel = "Volver",
  skipLabel = "Saltar",
  nextDisabled = false,
  isLoading = false,
  hideNext = false,
  hideBack = false,
  hideSkip = false,
  currentStep,
  totalSteps,
}: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t shadow-lg z-40">
      <div className="container mx-auto px-4 py-4">
        {currentStep && totalSteps && (
          <div className="text-center mb-3">
            <p className="text-sm text-muted-foreground">
              Paso {currentStep} de {totalSteps} <span className="text-xs">(opcional - podés saltar)</span>
            </p>
            <div className="w-full max-w-md mx-auto mt-2 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          {!hideBack && onBack ? (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="gap-2 border-2 hover:bg-muted"
              size="lg"
            >
              <ChevronLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          ) : (
            <div />
          )}
          
          <div className="flex gap-3">
            {!hideSkip && onSkip && (
              <Button
                variant="ghost"
                onClick={onSkip}
                disabled={isLoading}
                size="lg"
              >
                {skipLabel}
              </Button>
            )}
            
            {!hideNext && onNext && (
              <Button
                onClick={onNext}
                disabled={nextDisabled || isLoading}
                className="gap-2 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-md"
                size="lg"
              >
                {isLoading ? "Cargando..." : nextLabel}
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
