import { useState, useEffect } from "react";
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
import { ArrowLeft, Lightbulb, CheckCircle, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sanLuisCities = [
  "San Luis (capital)",
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

const EntrepreneurStep1 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Guardando tu idea...");
  const [ideaText, setIdeaText] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [suggestedIndustry, setSuggestedIndustry] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-guardado de borrador
  useEffect(() => {
    const interval = setInterval(() => {
      if (ideaText.length > 0) {
        localStorage.setItem('idea_draft', JSON.stringify({
          text: ideaText,
          location,
          industry,
          experience,
          timestamp: Date.now()
        }));
      }
    }, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, [ideaText, location, industry, experience]);

  // Recuperar borrador al montar
  useEffect(() => {
    const draft = localStorage.getItem('idea_draft');
    if (draft) {
      const parsed = JSON.parse(draft);
      const dayInMs = 86400000;
      if (Date.now() - parsed.timestamp < dayInMs) {
        setIdeaText(parsed.text || "");
        setLocation(parsed.location || "");
        setIndustry(parsed.industry || "");
        setExperience(parsed.experience || "");
      }
    }
  }, []);

  // Sugerencia automática de rubro
  useEffect(() => {
    const text = ideaText.toLowerCase();
    
    const rubroSuggestions: Record<string, string> = {
      'empanada|comida|restau|cocina|delivery comida|morfar|panadería|pan': 'Gastronomía (panadería, restaurante, café)',
      'pelo|corte|barber|peluqu|uñas|maquilla': 'Belleza y Estética (peluquería, spa, barbería)',
      'gym|entrena|fitness|depor': 'Salud y Bienestar (gimnasio, nutrición)',
      'kiosco|almacén|tienda|venta|boliche': 'Retail (almacén, kiosco, tienda)',
    };
    
    for (const [pattern, rubro] of Object.entries(rubroSuggestions)) {
      if (new RegExp(pattern).test(text)) {
        setSuggestedIndustry(rubro);
        break;
      }
    }
  }, [ideaText]);

  // Animación al completar 30 caracteres
  useEffect(() => {
    if (ideaText.length === 30) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [ideaText.length]);

  // Loading messages rotativos
  useEffect(() => {
    if (isLoading) {
      const messages = [
        "Guardando tu idea...",
        "Preparando análisis...",
        "Casi listo..."
      ];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingMessage(messages[index % messages.length]);
        index++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submit iniciado:', { ideaText, location, industry });
    
    if (!ideaText || ideaText.trim().length < 30) {
      toast({
        title: "Texto muy corto",
        description: "Contanos un poco más sobre tu idea (mínimo 30 caracteres)",
        variant: "destructive",
      });
      return;
    }
    
    if (!location || !industry) {
      toast({
        title: "Datos incompletos",
        description: "Elegí ubicación y rubro",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
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
          idea_description: ideaText.trim(),
          location: location,
          industry: industry,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Idea guardada:', data);
      
      // Limpiar borrador
      localStorage.removeItem('idea_draft');
      
      toast({
        title: "¡Idea guardada!",
        description: "Ahora vamos a analizarla",
      });
      
      navigate(`/onboarding/entrepreneur/analyzing?ideaId=${data.id}`);
      
    } catch (error: any) {
      console.error('Error completo:', error);
      toast({
        title: "Error",
        description: 'Hubo un problema guardando tu idea. Probá de nuevo.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = ideaText.trim().length >= 30 && location && industry;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/onboarding/classify')}
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Paso 1 de 5</span>
            <Progress value={20} className="h-2 w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold">
              Contanos tu idea de negocio
            </h1>
            <p className="text-lg text-muted-foreground">
              Con tus propias palabras, como se la contarías a un amigo
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-6">
              <Alert className="border-primary/20 bg-primary/5">
                <Lightbulb className="h-4 w-4 text-primary" />
                <AlertDescription>
                  💡 Escribí tranquilo, como le contarías a un amigo. Cuanto más detalles, mejor te podemos ayudar.
                </AlertDescription>
              </Alert>

              <Card className="w-full border-2 transition-all hover:border-primary hover:shadow-xl">
                <CardHeader>
                  <CardTitle>Tu Proyecto</CardTitle>
                  <CardDescription>
                    Completá todos los campos. Usá lenguaje informal, sin problema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="idea">¿Qué negocio querés crear?</Label>
                      <Textarea
                        id="idea"
                        placeholder="Ejemplo: Quiero poner un delivery de empanadas. Mi vieja cocina re bien y todos me dicen que las venda. Arrancaría con mi moto haciendo pedidos por WhatsApp, después ver de un local."
                        className="min-h-[180px] resize-y"
                        value={ideaText}
                        onChange={(e) => setIdeaText(e.target.value)}
                        maxLength={1000}
                        required
                      />
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "text-sm transition-colors",
                          ideaText.length >= 30 ? "text-green-600 font-medium" : "text-muted-foreground"
                        )}>
                          {ideaText.length}/1000 caracteres
                          {ideaText.length < 30 && " (mínimo 30)"}
                        </p>
                        {showSuccess && (
                          <div className="text-green-600 text-sm flex items-center gap-2 animate-fade-in">
                            <CheckCircle className="h-4 w-4" />
                            ¡Perfecto! Ya podés validar
                          </div>
                        )}
                      </div>
                      
                      {/* Preview */}
                      {ideaText.length > 0 && (
                        <Card className="p-4 bg-muted/50 mt-4">
                          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                          <p className="text-sm">{ideaText}</p>
                        </Card>
                      )}
                    </div>

                    {/* Sugerencia automática */}
                    {suggestedIndustry && !industry && (
                      <Alert className="border-primary/50 bg-primary/5">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                          <span>¿Tu rubro es <strong>{suggestedIndustry}</strong>?</span>
                          <Button 
                            type="button"
                            size="sm" 
                            variant="link" 
                            onClick={() => setIndustry(suggestedIndustry)}
                            className="h-auto p-0"
                          >
                            Sí, elegir
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

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

                    <div className="flex gap-3 pt-4 pb-20">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/onboarding/classify')}
                        disabled={isLoading}
                        className="flex-1 border-2 hover:bg-muted"
                      >
                        ← Volver
                      </Button>
                      <Button
                        type="submit"
                        variant="default"
                        disabled={isLoading || !isFormValid}
                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          "Validar mi idea →"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Tips laterales */}
            <div className="space-y-6">
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Tips para tu idea
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Contá QUÉ querés hacer</li>
                  <li>• DÓNDE sería (barrio, zona)</li>
                  <li>• PARA QUIÉN es</li>
                  <li>• QUÉ te hace diferente</li>
                </ul>
              </Card>

              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-3 text-sm">Ejemplos válidos:</h3>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="p-3 bg-background rounded-lg border">
                    "Laburo en un taller mecánico pero quiero el mío, tengo las herramientas ya"
                  </li>
                  <li className="p-3 bg-background rounded-lg border">
                    "Soy bueno cortando pelo, quiero una barbería piola en mi barrio"
                  </li>
                  <li className="p-3 bg-background rounded-lg border">
                    "Tengo ganas de un gimnasio funcional, acá no hay ninguno"
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="p-8 text-center max-w-sm">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium mb-2">{loadingMessage}</p>
            <p className="text-sm text-muted-foreground">
              No cierres esta ventana
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurStep1;
