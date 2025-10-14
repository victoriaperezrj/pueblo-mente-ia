import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Target, Zap, 
  ArrowRight, CheckCircle, Building2, Rocket, BarChart3 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';

export default function Homepage() {
  const navigate = useNavigate();
  const { role, loading } = useUserRole();
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && !loading && role) {
        // Redirect authenticated users to their dashboard
        switch (role) {
          case 'entrepreneur':
            navigate('/entrepreneur/dashboard');
            break;
          case 'business':
          case 'pyme_enterprise':
            navigate('/dashboard');
            break;
          case 'admin':
            navigate('/dashboard');
            break;
          default:
            navigate('/onboarding/classify');
        }
      }
    };
    
    checkAuthAndRedirect();
  }, [role, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary">
      {/* Fondo con grid sutil */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-bg-secondary/50 to-bg-secondary" />
      
      <div className="relative z-10">
        {/* Header */}
        <nav className="border-b border-border-light backdrop-blur-sm bg-bg-primary/80">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-entrepreneur-500 to-business-500 rounded-lg flex items-center justify-center shadow-soft">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-text-primary">Proyecto Emprendedurismo</h1>
                <p className="text-xs text-text-tertiary">Tu ecosistema empresarial completo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-4 py-2 text-sm font-medium bg-entrepreneur-500 text-white rounded-lg hover:bg-entrepreneur-600 transition shadow-soft"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        </nav>
        
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-entrepreneur-50 border border-entrepreneur-200 mb-8 animate-scale-in">
              <Zap className="w-4 h-4 text-entrepreneur-600" />
              <span className="text-sm font-medium text-entrepreneur-700">⚡ Potenciado con IA Argentina</span>
            </div>
            
            {/* Título */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-text-primary animate-fade-in">
              Tu negocio, del{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-entrepreneur-500 via-business-500 to-enterprise-500">
                plan a la acción
              </span>
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto animate-fade-in">
              Ecosistema digital para emprendedores argentinos. Validá ideas, organizá tu negocio o automatizá tu empresa con IA local.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
              <button
                onClick={() => navigate('/onboarding/classify?mode=demo')}
                className="group px-8 py-4 bg-gradient-to-r from-entrepreneur-500 to-business-500 text-white rounded-xl font-bold text-lg hover:scale-105 hover:shadow-hard transition-all duration-300 flex items-center justify-center gap-2 shadow-medium"
              >
                Explorar Demo Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
              
              <button
                onClick={() => navigate('/auth?mode=signup')}
                className="px-8 py-4 bg-bg-primary border-2 border-border-DEFAULT text-text-primary rounded-xl font-semibold text-lg hover:border-entrepreneur-300 hover:bg-entrepreneur-50 transition-all duration-300 shadow-soft hover:shadow-medium"
              >
                Crear Cuenta
              </button>
            </div>
            
            {/* Trust */}
            <div className="flex items-center justify-center gap-6 text-sm text-text-tertiary">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-enterprise-500" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-enterprise-500" />
                <span>100% gratis para empezar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-enterprise-500" />
                <span>Datos seguros en Argentina</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Camino del Emprendedor - Transición */}
        <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-r from-entrepreneur-50 via-business-50 to-enterprise-50 rounded-3xl my-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-entrepreneur-500 flex items-center justify-center text-white font-bold shadow-soft">1</div>
              <div className="w-32 h-1 bg-gradient-to-r from-entrepreneur-500 to-business-500"></div>
              <div className="w-12 h-12 rounded-full bg-business-500 flex items-center justify-center text-white font-bold shadow-soft">2</div>
              <div className="w-32 h-1 bg-gradient-to-r from-business-500 to-enterprise-500"></div>
              <div className="w-12 h-12 rounded-full bg-enterprise-500 flex items-center justify-center text-white font-bold shadow-soft">3</div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Camino del Emprendedor</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Proyecto Emprendedurismo te acompaña en cada fase de tu crecimiento: desde validar una idea hasta escalar tu empresa.
            </p>
          </div>
        </div>
        
        {/* Tres etapas */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">Tres etapas, una plataforma</h2>
            <p className="text-lg text-text-secondary">Elegí tu etapa actual y accedé a herramientas diseñadas específicamente para tus necesidades</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <StageCard
              icon={Rocket}
              badge="DESDE CERO"
              title="Emprendedor"
              subtitle="Tengo una Idea"
              description="Aún no arranqué, pero tengo una idea clara. Necesito validarla y hacer números."
              features={[
                'Lean Canvas interactivo',
                'Análisis con IA',
                'Simulador financiero',
                'Checklist AFIP'
              ]}
              buttonText="Empezar Validación 🚀"
              color="entrepreneur"
              onClick={() => navigate('/onboarding/classify?mode=demo')}
            />
            
            <StageCard
              icon={TrendingUp}
              badge="1-3 AÑOS"
              title="Negocio"
              subtitle="Tengo un Negocio"
              description="Ya vendo, pero llevo todo en Excel. Quiero organizarme mejor."
              features={[
                'Dashboard de ventas',
                'CRM de clientes',
                'Control de gastos',
                'Facturación AFIP'
              ]}
              buttonText="Organizar Negocio 📊"
              color="business"
              onClick={() => navigate('/onboarding/classify?mode=demo')}
              popular
            />
            
            <StageCard
              icon={BarChart3}
              badge="+3 AÑOS"
              title="PYME"
              subtitle="Tengo una Empresa"
              description="Tengo equipo y procesos. Quiero automatizar y escalar."
              features={[
                'Gestión de equipo',
                'Automatización',
                'Multi-sucursal',
                'Reportes ejecutivos'
              ]}
              buttonText="Automatizar Empresa 🏢"
              color="enterprise"
              onClick={() => navigate('/onboarding/classify?mode=demo')}
            />
          </div>
        </div>
        
        {/* CTA Final */}
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Empezá gratis hoy mismo</h2>
          <p className="text-lg text-text-secondary mb-8">No necesitás tarjeta de crédito. Probá todas las funcionalidades sin límites.</p>
          <button
            onClick={() => navigate('/onboarding/classify?mode=demo')}
            className="px-10 py-5 bg-gradient-to-r from-entrepreneur-500 to-business-500 text-white rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-hard"
          >
            Comenzar Ahora →
          </button>
        </div>
        
        {/* Footer */}
        <div className="border-t border-border-light py-8 bg-bg-primary/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-tertiary text-sm">
              <Building2 className="w-4 h-4" />
              <span>© 2025 Proyecto Emprendedurismo • San Luis, Argentina</span>
            </div>
            <div className="flex gap-6 text-sm text-text-tertiary">
              <button className="hover:text-text-primary transition">Términos</button>
              <button className="hover:text-text-primary transition">Privacidad</button>
              <button className="hover:text-text-primary transition">Soporte</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StageCardProps {
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  buttonText: string;
  color: 'entrepreneur' | 'business' | 'enterprise';
  onClick: () => void;
  popular?: boolean;
}

function StageCard({ icon: Icon, badge, title, subtitle, description, features, buttonText, color, onClick, popular }: StageCardProps) {
  const colors = {
    entrepreneur: {
      bg: 'from-entrepreneur-50 to-entrepreneur-100',
      border: 'border-entrepreneur-300',
      icon: 'from-entrepreneur-500 to-entrepreneur-600',
      badge: 'bg-entrepreneur-100 text-entrepreneur-700',
      button: 'bg-entrepreneur-500 hover:bg-entrepreneur-600 text-white',
      check: 'text-entrepreneur-500'
    },
    business: {
      bg: 'from-business-50 to-business-100',
      border: 'border-business-300',
      icon: 'from-business-500 to-business-600',
      badge: 'bg-business-100 text-business-700',
      button: 'bg-business-500 hover:bg-business-600 text-white',
      check: 'text-business-500'
    },
    enterprise: {
      bg: 'from-enterprise-50 to-enterprise-100',
      border: 'border-enterprise-300',
      icon: 'from-enterprise-500 to-enterprise-600',
      badge: 'bg-enterprise-100 text-enterprise-700',
      button: 'bg-enterprise-500 hover:bg-enterprise-600 text-white',
      check: 'text-enterprise-500'
    }
  };
  
  const c = colors[color];
  
  return (
    <div className={`relative bg-gradient-to-br ${c.bg} border-2 ${c.border} rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 shadow-soft hover:shadow-hard group`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-warning text-white text-xs font-bold rounded-full shadow-soft">
          ⭐ MÁS POPULAR
        </div>
      )}
      
      <div className={`w-16 h-16 bg-gradient-to-br ${c.icon} rounded-xl flex items-center justify-center mb-4 shadow-soft group-hover:shadow-medium transition-shadow`}>
        <Icon className="w-9 h-9 text-white" />
      </div>
      
      <div className={`inline-block px-3 py-1 ${c.badge} text-xs font-bold rounded-full mb-3`}>
        🚀 {badge}
      </div>
      
      <h3 className="text-2xl font-bold mb-1 text-text-primary">{title}</h3>
      <p className="text-base font-semibold text-text-secondary mb-3">{subtitle}</p>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
            <CheckCircle className={`w-4 h-4 ${c.check} mt-0.5 flex-shrink-0`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onClick}
        className={`w-full py-3 ${c.button} rounded-lg font-semibold transition flex items-center justify-center gap-2 group shadow-soft`}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </button>
    </div>
  );
}
