import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle, Loader2 } from "lucide-react";

interface WizardData {
  idea: string;
  problem: string;
  targetCustomer: string;
  revenue: string;
  budget: string;
}

interface IdeaValidatorWizardProps {
  onComplete: (data: WizardData) => void;
  loading?: boolean;
}

export function IdeaValidatorWizard({ onComplete, loading = false }: IdeaValidatorWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<WizardData>({
    idea: "",
    problem: "",
    targetCustomer: "",
    revenue: "",
    budget: ""
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.idea.length > 10;
      case 2:
        return formData.targetCustomer.length > 5;
      case 3:
        return formData.revenue.length > 0;
      case 4:
        return formData.budget.length > 0;
      default:
        return false;
    }
  };

  return (
    <Card className="border-2 overflow-hidden max-w-3xl mx-auto">
      <div className="h-1 bg-gradient-hero" />
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle>Validá tu Idea de Negocio</CardTitle>
          <span className="text-sm text-muted-foreground">Paso {step} de {totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Idea Description */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-2">📝 Cuéntanos tu idea</h3>
              <p className="text-sm text-muted-foreground">
                Describí tu negocio de la forma más clara posible
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea">¿Qué problema resuelve tu negocio? *</Label>
              <Textarea
                id="idea"
                placeholder="Ejemplo: Ayudo a pequeñas tiendas a vender online sin complicaciones técnicas"
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {formData.idea.length} caracteres (mínimo 10)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="problem">¿Por qué es importante resolver este problema?</Label>
              <Input
                id="problem"
                placeholder="Ejemplo: Las tiendas locales pierden ventas por no estar online"
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2: Target Customer */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-2">👥 Tu Cliente Ideal</h3>
              <p className="text-sm text-muted-foreground">
                ¿A quién le vas a vender?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCustomer">¿Quién es tu cliente ideal? *</Label>
              <Textarea
                id="targetCustomer"
                placeholder="Ejemplo: Dueños de tiendas locales de 30-50 años, con 1-5 empleados"
                value={formData.targetCustomer}
                onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                💡 <span className="font-semibold">Tip:</span> Sé específico. Entre más detallado, mejor análisis obtendrás.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Revenue Model */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-2">💰 Modelo de Ingresos</h3>
              <p className="text-sm text-muted-foreground">
                ¿Cómo ganarás dinero?
              </p>
            </div>

            <div className="space-y-2">
              <Label>¿Cómo ganarás dinero? *</Label>
              <RadioGroup 
                value={formData.revenue} 
                onValueChange={(value) => setFormData({ ...formData, revenue: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="products" id="products" />
                  <Label htmlFor="products" className="cursor-pointer flex-1">
                    Venta de productos físicos
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital" className="cursor-pointer flex-1">
                    Venta de productos digitales
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="services" id="services" />
                  <Label htmlFor="services" className="cursor-pointer flex-1">
                    Servicios/Consultoría
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="subscription" id="subscription" />
                  <Label htmlFor="subscription" className="cursor-pointer flex-1">
                    Suscripción mensual
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="commission" id="commission" />
                  <Label htmlFor="commission" className="cursor-pointer flex-1">
                    Comisiones por venta
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-gradient-primary/10 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-lg mb-2">💵 Presupuesto</h3>
              <p className="text-sm text-muted-foreground">
                ¿Cuánto podés invertir?
              </p>
            </div>

            <div className="space-y-2">
              <Label>¿Cuánto tiempo le dedicarás? *</Label>
              <RadioGroup 
                value={formData.budget} 
                onValueChange={(value) => setFormData({ ...formData, budget: value })}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="full-time" id="full-time" />
                  <Label htmlFor="full-time" className="cursor-pointer flex-1">
                    Tiempo completo (40+ hrs/semana)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="medium-time" id="medium-time" />
                  <Label htmlFor="medium-time" className="cursor-pointer flex-1">
                    Medio tiempo (20-40 hrs/semana)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="part-time" id="part-time" />
                  <Label htmlFor="part-time" className="cursor-pointer flex-1">
                    Part-time (menos de 20 hrs/semana)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="not-started" id="not-started" />
                  <Label htmlFor="not-started" className="cursor-pointer flex-1">
                    Aún no empecé
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-success/10 border border-success/30 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">¡Casi listo!</p>
                  <p className="text-sm text-muted-foreground">
                    Hacé clic en "Validar mi Idea" para obtener un análisis completo con IA
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
          )}
          
          <Button
            type="button"
            variant={step === totalSteps ? "gradient" : "default"}
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analizando con IA...
              </>
            ) : step === totalSteps ? (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Validar mi Idea
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}