import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Rocket, TrendingUp, Zap, 
  ArrowRight, Building2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
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
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
      {/* Header */}
      <nav className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-white font-bold text-xl">Proyecto Emprendedurismo</span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full font-semibold hover:bg-white/20 transition border border-white/30"
        >
          Iniciar Sesión
        </button>
      </nav>
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-semibold">
              Validación con Inteligencia Artificial
            </span>
          </div>
          
          {/* Título Principal */}
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Arrancá, crecé o innová{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              tu negocio
            </span>
            <br />
            con datos reales
          </h1>
          
          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium">
            Validamos ideas, calculamos números, ayudamos en trámites y potenciamos 
            tu negocio ya funcionando. Todo en un solo lugar.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={() => navigate('/onboarding/classify')}
              className="group bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition shadow-2xl flex items-center justify-center gap-2"
            >
              👉 Explorar Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            
            <button
              onClick={() => navigate('/auth')}
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition border-2 border-white/30"
            >
              Comenzar Gratis
            </button>
          </div>
          
          {/* Trust Badge */}
          <p className="text-white/80 text-sm pt-4">
            ✨ Sin tarjeta de crédito • 100% Gratis para empezar
          </p>
        </div>
      </div>
      
      {/* Features Section - Glassmorphism Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Para Emprendedores
            </h3>
            <p className="text-white/80">
              Validá tu idea con Lean Canvas, simulá rentabilidad y 
              recibí análisis de IA antes de invertir.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Negocios en Marcha
            </h3>
            <p className="text-white/80">
              Organizá finanzas, gestioná clientes, optimizá operaciones 
              y tomá decisiones con datos reales.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              PYMEs y Empresas
            </h3>
            <p className="text-white/80">
              Automatizá workflows, integrá sistemas existentes y 
              escalá con inteligencia artificial.
            </p>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-white/5 backdrop-blur-sm py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            ¿Cómo funciona?
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Elegí tu perfil
                </h3>
                <p className="text-white/80 text-lg">
                  ¿Tenés una idea? ¿Ya estás vendiendo? ¿Sos una PYME? 
                  Seleccioná tu etapa y accedé a herramientas personalizadas.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Contanos sobre tu negocio
                </h3>
                <p className="text-white/80 text-lg">
                  Describí tu idea o negocio en pocas palabras. Nuestra IA 
                  analizará el mercado y te dará proyecciones realistas.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Tomá decisiones con datos
                </h3>
                <p className="text-white/80 text-lg">
                  Recibí análisis financiero, recomendaciones de mercado, 
                  checklists de trámites y mucho más.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Empezá hoy mismo, gratis
        </h2>
        <p className="text-xl text-white/90 mb-8">
          No necesitás tarjeta de crédito. Explorá todas las funcionalidades sin límites.
        </p>
        <button
          onClick={() => navigate('/onboarding/classify')}
          className="bg-white text-purple-600 px-12 py-5 rounded-xl font-bold text-xl hover:scale-105 transition shadow-2xl inline-flex items-center gap-3"
        >
          Comenzar Ahora
          <Sparkles className="w-6 h-6" />
        </button>
      </div>
      
      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/60 text-sm">
            © 2025 Proyecto Emprendedurismo. Hecho con 💜 para emprendedores.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
