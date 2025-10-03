import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  isLoading?: boolean;
  hideNext?: boolean;
  hideBack?: boolean;
}

export function NavigationButtons({
  onBack,
  onNext,
  nextLabel = "Siguiente",
  backLabel = "Volver",
  nextDisabled = false,
  isLoading = false,
  hideNext = false,
  hideBack = false
}: NavigationButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t shadow-lg z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
          {!hideBack && onBack ? (
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="gap-2 border-2 hover:bg-muted"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          ) : (
            <div />
          )}
          
          {!hideNext && onNext && (
            <Button
              onClick={onNext}
              disabled={nextDisabled || isLoading}
              className="gap-2 bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-md"
              size="lg"
            >
              {isLoading ? "Cargando..." : nextLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
