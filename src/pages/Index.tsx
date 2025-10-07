import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, Rocket, TrendingUp, Shield, 
  ArrowRight, Building2 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (but don't redirect automatically)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        // User is logged in but we show homepage anyway
        // They can click to go to dashboard if they want
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fondo con gradiente animado */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),transparent_50%)]" />
      
      {/* Contenido */}
      <div className="relative z-10">
        {/* Header minimalista */}
        <nav className="p-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-sm sm:text-base">Proyecto Emprendedurismo</span>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Iniciar Sesión
          </button>
        </nav>
      
        {/* Hero Section */}
        <div className="px-4 pt-8 sm:pt-12 pb-16 sm:pb-20 max-w-4xl mx-auto">
          {/* Badge superior */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">Validación con IA</span>
            </div>
          </div>
          
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-4 leading-tight">
            Arrancá, crecé o
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
              innová tu negocio
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-gray-400 text-center mb-8 max-w-2xl mx-auto leading-relaxed">
            Validamos ideas, calculamos números y ayudamos en trámites.
            Todo con datos reales y análisis de inteligencia artificial.
          </p>
          
          {/* Botones principales */}
          <div className="flex flex-col gap-3 mb-12">
            <button
              onClick={() => navigate('/onboarding/classify')}
              className="w-full bg-white text-black py-4 px-6 rounded-xl font-bold text-base hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 group"
            >
              Explorar Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-white/5 border border-white/10 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/10 transition backdrop-blur-sm"
            >
              Crear Cuenta Gratis
            </button>
          </div>
          
          {/* Trust badge */}
          <p className="text-center text-gray-500 text-xs mb-12 sm:mb-16">
            ✨ Sin tarjeta • 100% Gratis • Sin límites
          </p>
          
          {/* Features cards - Stack en mobile */}
          <div className="space-y-4">
            <FeatureCard
              icon={Rocket}
              title="Para Emprendedores"
              description="Validá tu idea con Lean Canvas y análisis de IA antes de invertir."
              gradient="from-purple-500/10 to-pink-500/10"
            />
            
            <FeatureCard
              icon={TrendingUp}
              title="Negocios en Marcha"
              description="Organizá finanzas, gestioná clientes y optimizá operaciones."
              gradient="from-blue-500/10 to-cyan-500/10"
            />
            
            <FeatureCard
              icon={Shield}
              title="PYMEs y Empresas"
              description="Automatizá workflows e integrá sistemas con IA."
              gradient="from-green-500/10 to-emerald-500/10"
            />
          </div>
        </div>
      
        {/* Footer simple */}
        <div className="border-t border-white/5 py-6 text-center">
          <p className="text-gray-600 text-xs">
            © 2025 Proyecto Emprendedurismo
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente de Feature Card
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  gradient: string;
}) => {
  return (
    <div className={`
      bg-gradient-to-br ${gradient} 
      border border-white/5 rounded-2xl p-5 
      backdrop-blur-sm hover:border-white/10 transition
    `}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1">{title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
