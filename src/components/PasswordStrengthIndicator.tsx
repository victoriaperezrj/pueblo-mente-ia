import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthIndicator = ({ 
  password, 
  showRequirements = true 
}: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, text: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    // Calculate score
    if (checks.length) score += 25;
    if (checks.uppercase) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 15;

    // Determine strength level
    let text = "";
    let color = "";
    if (score < 40) {
      text = "Muy débil";
      color = "bg-destructive";
    } else if (score < 60) {
      text = "Débil";
      color = "bg-orange-500";
    } else if (score < 80) {
      text = "Media";
      color = "bg-yellow-500";
    } else if (score < 100) {
      text = "Buena";
      color = "bg-success";
    } else {
      text = "Muy fuerte";
      color = "bg-success";
    }

    return { score, text, color, checks };
  }, [password]);

  if (!password) return null;

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={met ? "text-success" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Fortaleza de la contraseña
          </span>
          <span className={`text-xs font-medium ${
            strength.score < 40 ? "text-destructive" :
            strength.score < 60 ? "text-orange-500" :
            strength.score < 80 ? "text-yellow-500" :
            "text-success"
          }`}>
            {strength.text}
          </span>
        </div>
        <Progress 
          value={strength.score} 
          className="h-2"
          indicatorClassName={strength.color}
        />
      </div>

      {/* Requirements List */}
      {showRequirements && password.length > 0 && (
        <div className="space-y-2 p-3 bg-muted/30 rounded-md border">
          <RequirementItem 
            met={strength.checks?.length || false} 
            text="Mínimo 8 caracteres" 
          />
          <RequirementItem 
            met={strength.checks?.uppercase || false} 
            text="Una letra mayúscula" 
          />
          <RequirementItem 
            met={strength.checks?.lowercase || false} 
            text="Una letra minúscula" 
          />
          <RequirementItem 
            met={strength.checks?.number || false} 
            text="Un número" 
          />
          <RequirementItem 
            met={strength.checks?.special || false} 
            text="Un carácter especial (opcional)" 
          />
        </div>
      )}

      {/* Security Tips */}
      {showRequirements && password.length > 0 && strength.score < 80 && (
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Tips:</strong> Usá una combinación de letras, números y símbolos. 
            Evitá palabras comunes o información personal.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Validation function for password strength
export const validatePasswordStrength = (password: string): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe incluir al menos una letra mayúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Debe incluir al menos una letra minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Debe incluir al menos un número");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
