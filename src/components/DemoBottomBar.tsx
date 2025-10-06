import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoBottomBarProps {
  onBack?: () => void;
  onSkip?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  hideBack?: boolean;
  hideSkip?: boolean;
  hideNext?: boolean;
  nextDisabled?: boolean;
  className?: string;
}

export function DemoBottomBar({
  onBack,
  onSkip,
  onNext,
  backLabel = "← ANTERIOR PASO",
  nextLabel = "SIGUIENTE PASO →",
  skipLabel = "Saltar",
  hideBack = false,
  hideSkip = false,
  hideNext = false,
  nextDisabled = false,
  className
}: DemoBottomBarProps) {
  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        "pb-safe",
        className
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3 max-w-4xl mx-auto">
          {/* Back Button */}
          {!hideBack && onBack ? (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 sm:flex-initial border-2 font-semibold"
            >
              {backLabel}
            </Button>
          ) : (
            <div className="flex-1 sm:flex-initial" />
          )}

          {/* Skip Button */}
          {!hideSkip && onSkip && (
            <Button
              variant="ghost"
              onClick={onSkip}
              className="flex-1 sm:flex-initial text-muted-foreground hover:text-foreground font-medium"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              {skipLabel}
            </Button>
          )}

          {/* Next Button */}
          {!hideNext && onNext ? (
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 shadow-lg font-semibold"
            >
              {nextLabel}
            </Button>
          ) : (
            <div className="flex-1 sm:flex-initial" />
          )}
        </div>
      </div>
    </div>
  );
}
