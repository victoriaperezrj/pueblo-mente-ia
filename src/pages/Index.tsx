import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, BarChart3, Target, Zap, 
  ArrowRight, CheckCircle, Building2 
} from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
      
      <div className="relative z-10">
        {/* Header */}
        <nav className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Proyecto Emprendedurismo</h1>
                <p className="text-xs text-slate-400">Plataforma de gestión empresarial</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition text-sm font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        </nav>
        
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Potenciado con Inteligencia Artificial</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Gestión empresarial{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-400 to-cyan-400">
                inteligente
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Validá ideas, calculá números, automatizá procesos y tomá decisiones 
              basadas en datos reales. Todo en una plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => navigate('/onboarding/classify')}
                className="px-6 sm:px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg font-bold text-base sm:text-lg hover:from-sky-600 hover:to-cyan-600 transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 group"
              >
                Explorar Demo Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-6 sm:px-8 py-4 bg-slate-800 border border-slate-700 rounded-lg font-semibold text-base sm:text-lg hover:bg-slate-700 transition"
              >
                Crear Cuenta
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Sin tarjeta</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>100% Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Sin límites</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Target}
              title="Emprendedores"
              description="Validá tu idea con Lean Canvas y análisis de mercado antes de invertir un peso."
              color="sky"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Negocios en Marcha"
              description="Organizá finanzas, gestioná clientes y optimizá operaciones con KPIs en tiempo real."
              color="emerald"
            />
            <FeatureCard
              icon={BarChart3}
              title="PYMEs y Empresas"
              description="Automatizá workflows, integrá sistemas y escalá con inteligencia artificial."
              color="amber"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-slate-800 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
              © 2025 Proyecto Emprendedurismo • San Luis, Argentina
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'sky' | 'emerald' | 'amber';
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    sky: 'from-sky-500/10 to-cyan-500/10 border-sky-500/20 hover:border-sky-500/40',
    emerald: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20 hover:border-emerald-500/40',
    amber: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40'
  };
  
  const iconColors = {
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400'
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 hover:scale-105 transition-all duration-300 backdrop-blur-sm`}>
      <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mb-4">
        <Icon className={`w-6 h-6 ${iconColors[color]}`} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
