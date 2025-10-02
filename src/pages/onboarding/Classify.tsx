import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Building2, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Classify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthAndProfile();
  }, []);

  const checkAuthAndProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user already has a user_type set
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.user_type) {
        // User already classified, redirect to appropriate flow
        if (profile.user_type === 'entrepreneur') {
          navigate('/onboarding/entrepreneur/step1');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

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
        navigate("/auth");
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

      // Redirect based on user type
      if (userType === 'entrepreneur') {
        navigate('/onboarding/entrepreneur/step1');
      } else {
        navigate('/dashboard');
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-6xl space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Emprendu
          </h1>
        </div>

        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            ¡Bienvenido a Emprendu! 🚀
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Contanos en qué etapa estás para personalizar tu experiencia
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* EMPRENDEDOR CARD */}
          <Card 
            className="hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary animate-fade-in"
            onClick={() => !loading && handleSelection('entrepreneur')}
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap className="h-16 w-16 text-primary" />
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  Desde cero
                </Badge>
                <CardTitle className="text-3xl">Soy Emprendedor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-center text-base leading-relaxed">
                Tengo una idea pero aún no la bajé a tierra. Necesito validación, plan de negocio y guía paso a paso.
              </CardDescription>
              
              <div className="space-y-3">
                {[
                  "Validar tu idea con IA",
                  "Plan de negocio personalizado",
                  "Simulador financiero",
                  "Checklist de permisos y regulaciones"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
                size="lg"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('entrepreneur');
                }}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Comenzar como Emprendedor
              </Button>
            </CardContent>
          </Card>

          {/* EMPRESARIO CARD */}
          <Card 
            className="hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-green-500 animate-fade-in"
            onClick={() => !loading && handleSelection('business_owner')}
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="text-center space-y-4 pb-4">
              <div className="mx-auto w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <Building2 className="h-16 w-16 text-green-500" />
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400 text-xs">
                  Negocio activo
                </Badge>
                <CardTitle className="text-3xl">Soy Empresario</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <CardDescription className="text-center text-base leading-relaxed">
                Ya tengo un negocio funcionando y quiero automatizar operaciones, gestionar ventas, inventario y turnos.
              </CardDescription>
              
              <div className="space-y-3">
                {[
                  "ERP completo (ventas, inventario, turnos)",
                  "Gestión de clientes y gastos",
                  "Marketplace B2B",
                  "Asistente de IA para tu negocio"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-green-600 hover:bg-green-700" 
                size="lg"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('business_owner');
                }}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Comenzar como Empresario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Classify;
