import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const EntrepreneurStep1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ideaDescription, setIdeaDescription] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  const sanLuisCities = [
    "San Luis",
    "Villa Mercedes",
    "Merlo",
    "La Punta",
    "Justo Daract",
    "Concarán",
    "Santa Rosa del Conlara",
    "Villa de la Quebrada",
    "Tilisarao",
    "Quines"
  ];

  const industries = [
    "Gastronomía",
    "Belleza",
    "Retail",
    "Servicios",
    "Salud",
    "Educación",
    "Tecnología",
    "Otro"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (ideaDescription.length < 50) {
      toast({
        title: "Descripción muy corta",
        description: "Por favor, contanos más sobre tu idea (mínimo 50 caracteres)",
        variant: "destructive",
      });
      return;
    }

    if (!location || !industry) {
      toast({
        title: "Faltan datos",
        description: "Por favor completá todos los campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "No se encontró usuario autenticado",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('business_ideas')
        .insert({
          user_id: user.id,
          idea_description: ideaDescription,
          location: location,
          industry: industry,
        });

      if (error) throw error;

      navigate('/onboarding/entrepreneur/analyzing');
    } catch (error: any) {
      console.error('Error saving idea:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar tu idea",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-3xl space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/onboarding')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Paso 1 de 5</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Cuéntanos tu Idea 💡
            </h1>
            <p className="text-muted-foreground">
              Mientras más detalles nos des, mejor podremos ayudarte
            </p>
          </div>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Paso 1: Cuéntanos tu idea</CardTitle>
            <CardDescription>
              Describi tu proyecto con todos los detalles que puedas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idea">¿Qué negocio querés crear?</Label>
                <Textarea
                  id="idea"
                  placeholder="Ejemplo: Quiero abrir una panadería artesanal en Villa Mercedes con foco en productos sin TACC"
                  className="min-h-[120px] resize-none"
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {ideaDescription.length} / 50 caracteres mínimos
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">¿En qué ciudad?</Label>
                <Select value={location} onValueChange={setLocation} required>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Seleccioná tu ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {sanLuisCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">¿Qué rubro?</Label>
                <Select value={industry} onValueChange={setIndustry} required>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Seleccioná el rubro" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/onboarding')}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Guardando..." : "Validar mi Idea →"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EntrepreneurStep1;
