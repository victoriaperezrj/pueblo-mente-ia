import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Store, Building2, Check, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type UserType = 'entrepreneur' | 'business_owner' | 'enterprise';

const Classify = () => {
  const navigate = useNavigate();
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.user_type) {
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

  const handleSelect = async (type: UserType) => {
    setLoading(true);
    try {
      // For entrepreneur, use guest mode
      if (type === 'entrepreneur') {
        localStorage.setItem('user_profile', 'emprendedor');
        localStorage.setItem('is_guest_mode', 'true');
        navigate('/demo/emprendedor/dashboard');
        return;
      }

      // For other types, show "coming soon" message
      toast.info("Esta sección estará disponible pronto. Enfócate en validar tu idea primero 🚀");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ¿En qué etapa estás?
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Elegí la opción que mejor te describa
          </p>
          <p className="text-sm text-muted-foreground">
            (opcional - podés saltar este paso)
          </p>
        </div>
        
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            Saltar todo e ir al dashboard →
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* OPCIÓN 1: EMPRENDEDOR */}
          <Card className="p-8 hover:shadow-2xl transition-all border-2 hover:border-purple-500 cursor-pointer group">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100">
              Desde Cero
            </Badge>
            
            <h3 className="text-2xl font-bold mb-3">
              Tengo una Idea
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Todavía no arranqué. Quiero validar si mi idea funciona, armar el plan y calcular los números antes de invertir.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Validación de viabilidad realista</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Plan de negocio paso a paso</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Simulador financiero con inflación</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Calculadora de producción</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Regulaciones y permisos</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white"
              onClick={() => handleSelect('entrepreneur')}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Empezar Validación →"}
            </Button>
          </Card>

          {/* OPCIÓN 2: NEGOCIO ACTIVO */}
          <Card className="p-8 hover:shadow-2xl transition-all border-2 hover:border-blue-500 cursor-pointer group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Store className="h-8 w-8 text-white" />
            </div>
            
            <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
              1 a 3 Años
            </Badge>
            
            <h3 className="text-2xl font-bold mb-3">
              Ya Tengo mi Negocio
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mi emprendimiento está funcionando pero llevo todo a mano o en Excel. Quiero organizarme mejor y crecer.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Registrar ventas y gastos fácil</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Controlar inventario en tiempo real</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Gestionar clientes y agenda</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ver reportes y números claros</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Compras en grupo (ahorrá)</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-white"
              onClick={() => handleSelect('business_owner')}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Organizar mi Negocio →"}
            </Button>
          </Card>

          {/* OPCIÓN 3: PYME/EMPRESA */}
          <Card className="p-8 hover:shadow-2xl transition-all border-2 hover:border-emerald-500 cursor-pointer group">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
              +3 Años
            </Badge>
            
            <h3 className="text-2xl font-bold mb-3">
              Soy PYME/Empresa
            </h3>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tengo un negocio establecido con equipo y procesos. Quiero automatizar, innovar y escalar con IA.
            </p>
            
            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automatización de workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>IA predictiva y análisis avanzado</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Gestión multi-sucursal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Integraciones con sistemas existentes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Business Intelligence</span>
              </li>
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:opacity-90 text-white"
              onClick={() => handleSelect('enterprise')}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Innovar y Automatizar →"}
            </Button>
          </Card>

        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Classify;
