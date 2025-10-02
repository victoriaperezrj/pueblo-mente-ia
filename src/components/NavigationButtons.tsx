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
    <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t">
      {!hideBack && onBack ? (
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="gap-2 border-2"
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
          className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white"
        >
          {isLoading ? "Cargando..." : nextLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
