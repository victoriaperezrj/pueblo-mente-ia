import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lightbulb } from "lucide-react";

const EntrepreneurStep1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ideaDescription, setIdeaDescription] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");

  const sanLuisCities = [
    "San Luis",
    "Villa Mercedes",
    "Merlo",
    "La Punta",
    "Juana Koslay",
    "El Trapiche",
    "Potrero de los Funes",
    "Concarán",
    "Tilisarao",
    "Otra ciudad"
  ];

  const industries = [
    "Gastronomía (panadería, restaurante, café)",
    "Belleza y Estética (peluquería, spa, barbería)",
    "Retail (almacén, kiosco, tienda)",
    "Servicios Profesionales (consultoría, contabilidad)",
    "Salud y Bienestar (gimnasio, nutrición)",
    "Educación (instituto, clases particulares)",
    "Tecnología (desarrollo, diseño, marketing digital)",
    "Construcción y Mantenimiento",
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

      const { data, error } = await supabase
        .from('business_ideas')
        .insert({
          user_id: user.id,
          idea_description: ideaDescription,
          location: location,
          industry: industry,
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/onboarding/entrepreneur/analyzing?ideaId=${data.id}`);
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
              Paso 1: Contanos tu idea
            </h1>
            <p className="text-muted-foreground">
              Describí tu idea de negocio con la mayor cantidad de detalles posible
            </p>
          </div>
        </div>

        <Alert className="border-primary/20 bg-primary/5">
          <Lightbulb className="h-4 w-4 text-primary" />
          <AlertDescription>
            💡 Cuanto más detallada sea tu idea, mejor será el análisis. Incluí: tipo de productos/servicios, público objetivo, y qué te hace diferente.
          </AlertDescription>
        </Alert>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Información de tu proyecto</CardTitle>
            <CardDescription>
              Completá todos los campos para validar tu idea
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="idea">¿Qué negocio querés crear?</Label>
                <Textarea
                  id="idea"
                  placeholder="Ejemplo: Quiero abrir una panadería artesanal en Villa Mercedes con foco en productos sin TACC y panes de masa madre. El local sería en zona céntrica, cerca de escuelas."
                  className="min-h-[150px] resize-y"
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  maxLength={500}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {ideaDescription.length}/500 caracteres {ideaDescription.length < 50 && `(mínimo 50)`}
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

              <div className="space-y-3">
                <Label>¿Tenés experiencia en este rubro?</Label>
                <RadioGroup value={experience} onValueChange={setExperience}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="exp-yes" />
                    <Label htmlFor="exp-yes" className="font-normal cursor-pointer">
                      Sí, trabajé en el rubro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="researched" id="exp-researched" />
                    <Label htmlFor="exp-researched" className="font-normal cursor-pointer">
                      No, pero investigué mucho
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="exp-no" />
                    <Label htmlFor="exp-no" className="font-normal cursor-pointer">
                      No, es completamente nuevo para mí
                    </Label>
                  </div>
                </RadioGroup>
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
                  disabled={loading || ideaDescription.length < 50 || !location || !industry}
                  className="flex-1"
                >
                  {loading ? "Analizando..." : "Validar mi Idea →"}
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
