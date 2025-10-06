import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoginModal } from "@/components/LoginModal";

const Index = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Get user profile to redirect to correct dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profile?.user_type === 'entrepreneur') {
          navigate('/entrepreneur/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // No session - activate guest mode automatically
        localStorage.setItem('is_guest_mode', 'true');
        localStorage.setItem('guest_session_id', crypto.randomUUID());
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl p-2 shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">
              Proyecto Emprendedurismo
            </span>
          </div>
          <Button 
            onClick={() => navigate("/auth")} 
            size="lg" 
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-violet-200">
            <Zap className="h-4 w-4" />
            <span>Validación con Inteligencia Artificial</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Arrancá, crecé o innová
            </span>
            {" "}tu negocio con datos reales
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Validamos ideas, calculamos números, ayudamos en trámites y potenciamos tu negocio ya funcionando. Todo en un solo lugar.
          </p>
          
          <div className="flex flex-col gap-4 justify-center items-center mb-12">
            <Button 
              size="lg"
              variant="outline"
              onClick={() => {
                localStorage.setItem('is_guest_mode', 'true');
                localStorage.setItem('guest_session_id', crypto.randomUUID());
                navigate("/demo/intro");
              }}
              className="text-lg px-10 py-6 border-2 font-semibold transition-all hover:scale-102"
            >
              👉 Explorar Demo
            </Button>
            <Button 
              size="lg" 
              onClick={() => setLoginModalOpen(true)}
              className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 font-bold"
            >
              Comenzar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { value: "500+", label: "Emprendedores" },
            { value: "20+", label: "Rubros" },
            { value: "24/7", label: "Asistencia" },
            { value: "100%", label: "Gratis" },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-bold text-violet-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Todo lo que necesitás en un solo lugar
          </h2>
          <p className="text-lg text-gray-600">
            Herramientas simples y poderosas para tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: Zap,
              title: "Validación de Ideas",
              description: "Analizamos tu idea con datos reales del mercado y te decimos si puede funcionar",
            },
            {
              icon: TrendingUp,
              title: "Simulador Financiero",
              description: "Calculá cuánta plata necesitás y cuánto vas a ganar con números realistas",
            },
            {
              icon: Users,
              title: "Gestión Completa",
              description: "Llevá ventas, productos, clientes y turnos todo desde un solo lugar",
            },
            {
              icon: Building2,
              title: "Multi-negocios",
              description: "Gestioná varios emprendimientos desde una sola cuenta",
            },
            {
              icon: TrendingUp,
              title: "Compras en Grupo",
              description: "Ahorrá comprando con otros emprendedores de tu zona",
            },
            {
              icon: Users,
              title: "Asistente 24/7",
              description: "Preguntá lo que necesites, cuando lo necesites",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-12 md:p-16 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para arrancar tu negocio?
          </h2>
          <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
            Empezá hoy mismo. Es 100% gratis y no necesitás tarjeta de crédito.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="text-lg px-10 py-6 bg-white text-violet-600 hover:bg-gray-100 shadow-lg font-semibold"
          >
            Crear Cuenta Gratis
            <span className="ml-2">🚀</span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg p-1.5">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">
                Proyecto Emprendedurismo
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              © 2025 Proyecto Emprendedurismo - Tu negocio paso a paso
            </p>
            <p className="text-xs text-gray-500">
              🇦🇷 Hecho en Argentina
            </p>
          </div>
        </div>
      </footer>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default Index;
