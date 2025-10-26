import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type Stage = "entrepreneur" | "business" | "pyme_enterprise";

interface FormStepProps {
  stage: Stage;
  onSubmit: (data: Record<string, string>) => void;
  onBack: () => void;
}

export function FormStep({ stage, onSubmit, onBack }: FormStepProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderEntrepreneurForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="problem_description" className="text-white">
          ¿Qué problema resuelve tu idea? *
        </Label>
        <Textarea
          id="problem_description"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: Las personas tienen dificultad para..."
          value={formData.problem_description || ""}
          onChange={(e) => handleChange("problem_description", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_customer" className="text-white">
          ¿Quién es tu cliente ideal? *
        </Label>
        <Input
          id="target_customer"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: Jóvenes de 18-30 años que..."
          value={formData.target_customer || ""}
          onChange={(e) => handleChange("target_customer", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="available_time" className="text-white">
          ¿Cuánto tiempo podés dedicar por semana?
        </Label>
        <Select
          value={formData.available_time || ""}
          onValueChange={(value) => handleChange("available_time", value)}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Seleccioná una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-5">0-5 horas</SelectItem>
            <SelectItem value="5-15">5-15 horas</SelectItem>
            <SelectItem value="15-40">15-40 horas</SelectItem>
            <SelectItem value="40+">Tiempo completo (40+ horas)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="initial_budget" className="text-white">
          ¿Con qué presupuesto inicial contás?
        </Label>
        <Select
          value={formData.initial_budget || ""}
          onValueChange={(value) => handleChange("initial_budget", value)}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Seleccioná una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-50k">Menos de $50,000</SelectItem>
            <SelectItem value="50k-200k">$50,000 - $200,000</SelectItem>
            <SelectItem value="200k-500k">$200,000 - $500,000</SelectItem>
            <SelectItem value="500k+">Más de $500,000</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const renderBusinessForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="business_type" className="text-white">
          ¿Qué tipo de negocio tenés? *
        </Label>
        <Select
          value={formData.business_type || ""}
          onValueChange={(value) => handleChange("business_type", value)}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Seleccioná una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comercio">Comercio/Retail</SelectItem>
            <SelectItem value="servicios">Servicios</SelectItem>
            <SelectItem value="produccion">Producción/Manufactura</SelectItem>
            <SelectItem value="gastronomia">Gastronomía</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="time_in_business" className="text-white">
          ¿Hace cuánto tenés el negocio? *
        </Label>
        <Select
          value={formData.time_in_business || ""}
          onValueChange={(value) => handleChange("time_in_business", value)}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Seleccioná una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-6m">Menos de 6 meses</SelectItem>
            <SelectItem value="6m-1y">6 meses - 1 año</SelectItem>
            <SelectItem value="1-3y">1 - 3 años</SelectItem>
            <SelectItem value="3y+">Más de 3 años</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthly_customers" className="text-white">
          ¿Cuántos clientes tenés por mes (aproximadamente)?
        </Label>
        <Input
          id="monthly_customers"
          type="number"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: 50"
          value={formData.monthly_customers || ""}
          onChange={(e) => handleChange("monthly_customers", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="main_problem" className="text-white">
          ¿Cuál es tu principal problema o desafío? *
        </Label>
        <Textarea
          id="main_problem"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: Me cuesta conseguir nuevos clientes..."
          value={formData.main_problem || ""}
          onChange={(e) => handleChange("main_problem", e.target.value)}
          rows={4}
        />
      </div>
    </>
  );

  const renderPymeForm = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="company_description" className="text-white">
          Contanos sobre tu empresa *
        </Label>
        <Textarea
          id="company_description"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: Somos una empresa de..."
          value={formData.company_description || ""}
          onChange={(e) => handleChange("company_description", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee_count" className="text-white">
          ¿Cuántos empleados tenés? *
        </Label>
        <Input
          id="employee_count"
          type="number"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: 15"
          value={formData.employee_count || ""}
          onChange={(e) => handleChange("employee_count", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthly_revenue" className="text-white">
          Facturación mensual aproximada *
        </Label>
        <Input
          id="monthly_revenue"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: $500,000"
          value={formData.monthly_revenue || ""}
          onChange={(e) => handleChange("monthly_revenue", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="main_challenge" className="text-white">
          ¿Cuál es tu desafío principal para escalar? *
        </Label>
        <Textarea
          id="main_challenge"
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Ej: Necesito estructurar mejor los procesos..."
          value={formData.main_challenge || ""}
          onChange={(e) => handleChange("main_challenge", e.target.value)}
          rows={4}
        />
      </div>
    </>
  );

  const stageNames = {
    entrepreneur: "Emprendedor",
    business: "Negocio",
    pyme_enterprise: "PyME",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between text-white">
        <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <div className="text-sm font-medium">PASO 2 DE 3</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-white/95 dark:bg-white/10 backdrop-blur-xl p-8">
          <h2 className="text-3xl font-bold mb-2">
            Perfil {stageNames[stage]}
          </h2>
          <p className="text-muted-foreground mb-8">
            Completá la información para personalizar tu experiencia
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {stage === "entrepreneur" && renderEntrepreneurForm()}
            {stage === "business" && renderBusinessForm()}
            {stage === "pyme_enterprise" && renderPymeForm()}

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Volver
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--pyme))]"
              >
                Continuar
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
