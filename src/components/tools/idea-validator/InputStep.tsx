import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lightbulb, CheckCircle2 } from "lucide-react";

interface IdeaData {
  title: string;
  description: string;
  location?: string;
  businessType?: string;
  budget?: string;
}

interface InputStepProps {
  onAnalyze: (data: IdeaData) => void;
  onBack: () => void;
}

const tips = [
  "💡 Sé específico sobre qué problema resuelve tu idea",
  "🎯 Describe quién es tu cliente ideal",
  "💰 Menciona cómo pensás generar ingresos",
  "🚀 Explica qué te hace diferente a la competencia",
];

export function InputStep({ onAnalyze, onBack }: InputStepProps) {
  const [formData, setFormData] = useState<IdeaData>({
    title: "",
    description: "",
    location: "",
    businessType: "",
    budget: "",
  });
  const [currentTip, setCurrentTip] = useState(0);

  const handleChange = (field: keyof IdeaData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };

  const isValid = formData.title.trim() !== "" && formData.description.trim().length >= 50;

  // Rotate tips every 5 seconds
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Dashboard
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--pyme))] flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Validador de Ideas</CardTitle>
                  <CardDescription>Analizá tu idea antes de invertir</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Título de tu idea *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Ej: Plataforma de delivery de comida saludable"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descripción detallada * (mínimo 50 caracteres)
                  </Label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Describí tu idea en detalle: qué problema resuelve, quién es tu cliente, cómo funciona, qué te hace único..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    required
                    minLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/50 caracteres
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación (opcional)</Label>
                    <Input
                      id="location"
                      placeholder="Ej: Buenos Aires, Argentina"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Tipo de negocio (opcional)</Label>
                    <Select
                      value={formData.businessType}
                      onValueChange={(value) => handleChange("businessType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccioná una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="producto">Producto físico</SelectItem>
                        <SelectItem value="servicio">Servicio</SelectItem>
                        <SelectItem value="software">Software/App</SelectItem>
                        <SelectItem value="marketplace">Marketplace</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Presupuesto inicial (opcional)</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => handleChange("budget", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná un rango" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50k">Menos de $50,000</SelectItem>
                      <SelectItem value="50k-200k">$50,000 - $200,000</SelectItem>
                      <SelectItem value="200k-500k">$200,000 - $500,000</SelectItem>
                      <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                      <SelectItem value="1m+">Más de $1,000,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--pyme))] text-lg py-6"
                  disabled={!isValid}
                  size="lg"
                >
                  Analizar mi idea
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-medium">
                  {tips[currentTip]}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {formData.title.trim() !== "" ? (
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Título definido</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.description.length >= 50 ? (
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Descripción completa (50+ caracteres)</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.location ? (
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                  <span className="text-sm">Ubicación (opcional)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
