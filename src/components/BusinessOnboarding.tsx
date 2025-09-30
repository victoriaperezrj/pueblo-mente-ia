import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Loader2 } from "lucide-react";

interface BusinessOnboardingProps {
  onComplete: () => void;
}

const BUSINESS_TYPES = [
  { value: "bakery", label: "Panadería 🥖" },
  { value: "hair_salon", label: "Peluquería ✂️" },
  { value: "grocery_store", label: "Almacén 🏪" },
  { value: "restaurant", label: "Restaurante 🍽️" },
  { value: "pharmacy", label: "Farmacia 💊" },
  { value: "other", label: "Otro 📦" },
];

const LOCATIONS = [
  "San Luis Capital",
  "Villa Mercedes",
  "La Punta",
  "Merlo",
  "Juana Koslay",
  "El Volcán",
  "Otro",
];

const BusinessOnboarding = ({ onComplete }: BusinessOnboardingProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error("Perfil no encontrado");

      const { error } = await supabase.from("businesses").insert({
        user_id: profile.id,
        name,
        business_type: businessType as any,
        location,
        setup_stage: "idea_validation" as any,
      });

      if (error) throw error;

      toast({
        title: "🎉 ¡Negocio creado!",
        description: "Ahora podés comenzar a gestionar tu emprendimiento",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-success/5">
      <Card className="w-full max-w-md border-2 shadow-2xl animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-primary rounded-2xl p-4 shadow-lg animate-bounce-subtle">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">¡Bienvenido a PuebloHub! 👋</CardTitle>
          <CardDescription className="text-base">
            Creá tu primer negocio para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre del Negocio *</Label>
              <Input
                placeholder="Ej: Panadería San Luis"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Negocio *</Label>
              <Select value={businessType} onValueChange={setBusinessType} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Seleccioná tu rubro" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ubicación *</Label>
              <Select value={location} onValueChange={setLocation} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="¿Dónde está tu negocio?" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all mt-6" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Crear Mi Negocio
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Podés crear múltiples negocios desde tu perfil
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessOnboarding;
