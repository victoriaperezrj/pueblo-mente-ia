import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSelection = async (userType: 'entrepreneur' | 'business_owner') => {
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
        .from('profiles')
        .update({ user_type: userType })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "¡Perfecto!",
        description: userType === 'entrepreneur' 
          ? "Comenzaremos validando tu idea" 
          : "Te ayudaremos a automatizar tu negocio",
      });

      // Redirigir según tipo de usuario
      if (userType === 'entrepreneur') {
        navigate('/onboarding/entrepreneur/step1');
      } else {
        navigate('/onboarding/business/step1');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar tu selección",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-5xl space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            ¡Bienvenido a Emprendu! 🚀
          </h1>
          <p className="text-lg text-muted-foreground">
            Contanos en qué etapa estás para personalizar tu experiencia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* TARJETA EMPRENDEDOR */}
          <Card 
            className="hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
            onClick={() => !loading && handleSelection('entrepreneur')}
          >
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Soy Emprendedor</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Desde cero
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-center text-base">
                Tengo una idea pero aún no la bajé a tierra. Necesito validación y guía paso a paso.
              </CardDescription>
              <Button 
                className="w-full" 
                size="lg"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('entrepreneur');
                }}
              >
                Comenzar como Emprendedor
              </Button>
            </CardContent>
          </Card>

          {/* TARJETA EMPRESARIO */}
          <Card 
            className="hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-green-500"
            onClick={() => !loading && handleSelection('business_owner')}
          >
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Building2 className="w-10 h-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Soy Empresario</CardTitle>
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 dark:text-green-400">
                  Negocio activo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-center text-base">
                Ya tengo un negocio funcionando y quiero automatizar operaciones con IA.
              </CardDescription>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('business_owner');
                }}
              >
                Comenzar como Empresario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
