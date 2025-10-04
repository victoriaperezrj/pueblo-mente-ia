import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { CalculationResult, formatCurrency } from "@/lib/finance";
import { cn } from "@/lib/utils";

interface CalculationDisplayProps {
  title: string;
  description?: string;
  result: CalculationResult<number>;
  format?: 'currency' | 'percentage' | 'number';
  icon?: React.ReactNode;
  className?: string;
  showFormula?: boolean;
}

export function CalculationDisplay({
  title,
  description,
  result,
  format = 'currency',
  icon,
  className,
  showFormula = true
}: CalculationDisplayProps) {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
        return value.toLocaleString('es-AR', { maximumFractionDigits: 2 });
      default:
        return value.toString();
    }
  };

  const hasWarning = result.missingInputs.some(msg => msg.includes('⚠️'));

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {result.value !== null ? (
          <>
            <div className="text-3xl font-bold">
              {formatValue(result.value)}
            </div>
            
            {showFormula && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground font-mono bg-muted p-3 rounded-lg">
                  <div className="font-semibold mb-2">📐 Fórmula:</div>
                  <div>{result.formula}</div>
                </div>
                
                {Object.keys(result.inputs).length > 0 && (
                  <div className="text-xs space-y-1">
                    <div className="font-semibold text-muted-foreground">Variables usadas:</div>
                    {Object.entries(result.inputs).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-muted-foreground">
                        <span>{key}:</span>
                        <span className="font-mono">
                          {typeof value === 'number' && format === 'currency' 
                            ? formatCurrency(value)
                            : value.toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <Alert variant={hasWarning ? "destructive" : "default"} className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-2">
                {hasWarning ? '⚠️ No se puede calcular:' : 'Faltan datos:'}
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.missingInputs.map((input, idx) => (
                  <li key={idx}>{input}</li>
                ))}
              </ul>
              {showFormula && (
                <div className="mt-3 text-xs font-mono bg-background/50 p-2 rounded">
                  {result.formula}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
