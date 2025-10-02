import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Lightbulb, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Gastronomía",
  "Belleza y Estética", 
  "Salud y Bienestar",
  "Retail",
  "Educación",
  "Servicios",
  "Tecnología",
  "Otro"
];

const LOCATIONS = [
  "San Luis Capital",
  "Villa Mercedes",
  "La Punta",
  "Merlo",
  "Potrero de los Funes",
  "Juana Koslay",
  "Otro"
];

export default function DemoIdeaCapture() {
  const navigate = useNavigate();
  const [ideaText, setIdeaText] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ideaText || ideaText.trim().length < 30) {
      return;
    }
    
    if (!location || !industry) {
      return;
    }
    
    // Guardar en localStorage para el demo
    localStorage.setItem('demo_idea', JSON.stringify({
      description: ideaText.trim(),
      location,
      industry,
      timestamp: Date.now()
    }));
    
    navigate('/demo/analyzing');
  };

  const isValid = ideaText.trim().length >= 30 && location && industry;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-2.5 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Proyecto Emprendedurismo
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Banner Demo */}
        <Alert className="mb-6 border-yellow-500 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Estás en MODO DEMO. Nada se guardará. 
            <Button 
              variant="link" 
              onClick={() => navigate('/auth')}
              className="p-0 h-auto ml-1 text-yellow-700 dark:text-yellow-400"
            >
              Crear cuenta
            </Button> 
            {" "}para guardar tus datos.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  Contanos tu idea
                </CardTitle>
                <CardDescription>
                  Escribí con tus palabras qué querés hacer. No importa cómo lo digas, lo importante es que nos cuentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="idea">Tu idea de negocio</Label>
                    <Textarea
                      id="idea"
                      placeholder="Ejemplo: Quiero poner un delivery de empanadas. Mi vieja cocina re bien y todos me dicen que las venda. Arrancaría con mi moto haciendo pedidos por WhatsApp, después ver de un local."
                      className="min-h-[200px] text-base"
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      maxLength={1000}
                    />
                    <p className={cn(
                      "text-sm transition-colors",
                      ideaText.length >= 30 ? "text-green-600" : "text-muted-foreground"
                    )}>
                      {ideaText.length}/1000 caracteres
                      {ideaText.length < 30 && " (mínimo 30)"}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">¿Dónde sería?</Label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Elegí ubicación" />
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

                    <div className="space-y-2">
                      <Label htmlFor="industry">¿Qué tipo de negocio?</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Elegí rubro" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => navigate('/demo/intro')}
                      className="border-2"
                    >
                      ← Volver
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!isValid}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                    >
                      Validar mi Idea →
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
