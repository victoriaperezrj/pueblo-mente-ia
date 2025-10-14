import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Target, Zap, ArrowRight, CheckCircle, 
  Building2, Rocket, BarChart3, Sparkles, Brain, Users,
  Shield, Gauge, Menu, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Homepage() {
  const navigate = useNavigate();
  const { role, loading } = useUserRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && !loading && role) {
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
    <div className="min-h-screen bg-gradient-to-br from-[#7B61FF]/5 via-[#4E9FFF]/5 to-[#3DC67B]/5 text-foreground overflow-x-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-gradient" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="relative z-10">
        {/* Modern Header */}
        <nav className="backdrop-blur-xl bg-background/60 border-b border-border/40 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7B61FF] to-[#4E9FFF] rounded-xl flex items-center justify-center shadow-lg animate-float">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg">Proyecto Emprendedurismo</h1>
                  <p className="text-xs text-muted-foreground">Tu ecosistema empresarial completo</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth?mode=login')}
                  className="font-medium"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="bg-gradient-to-r from-[#7B61FF] to-[#4E9FFF] text-white font-semibold hover:opacity-90 shadow-lg"
                >
                  Crear Cuenta
                </Button>
              </div>

              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-2 animate-scale-in">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth?mode=login')}
                  className="w-full justify-center"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="w-full justify-center bg-gradient-to-r from-[#7B61FF] to-[#4E9FFF] text-white"
                >
                  Crear Cuenta
                </Button>
              </div>
            )}
          </div>
        </nav>
        
        {/* Hero Section - Immersive */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          {/* Floating gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#7B61FF]/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4E9FFF]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          
          <div className="relative text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7B61FF]/10 to-[#4E9FFF]/10 border border-[#7B61FF]/20 mb-8 animate-scale-in backdrop-blur-sm">
              <Zap className="w-4 h-4 text-[#7B61FF] animate-bounce-subtle" />
              <span className="text-sm font-semibold bg-gradient-to-r from-[#7B61FF] to-[#4E9FFF] bg-clip-text text-transparent">
                Potenciado con IA Argentina
              </span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              Tu negocio,{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] via-[#4E9FFF] to-[#3DC67B] animate-gradient neon-glow">
                  del plan a la acción
                </span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed">
              Ecosistema inteligente para emprendedores argentinos. 
              <br className="hidden sm:block" />
              Validá ideas, ordená tus números y automatizá tu empresa con IA local.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <Button
                onClick={() => navigate('/onboarding/classify?mode=demo')}
                size="lg"
                className="group px-8 py-6 bg-gradient-to-r from-[#7B61FF] to-[#4E9FFF] text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-[#7B61FF]/50 hover:scale-105 transition-all duration-300 animate-glow-pulse"
              >
                Explorar Demo Gratis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition" />
              </Button>
              
              <Button
                onClick={() => navigate('/auth?mode=signup')}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-semibold rounded-2xl border-2 hover:bg-[#7B61FF]/5 hover:border-[#7B61FF]/50 transition-all"
              >
                Crear Cuenta
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3DC67B]" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3DC67B]" />
                <span>Gratis para empezar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#3DC67B]" />
                <span>Datos seguros en Argentina</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Camino del Emprendedor - Interactive Journey */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="bg-gradient-to-br from-[#7B61FF]/10 via-[#4E9FFF]/10 to-[#3DC67B]/10 rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-sm border border-white/20 shadow-2xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-[#7B61FF] to-[#3DC67B] bg-clip-text text-transparent">
                Camino del Emprendedor
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Crecé paso a paso: validá, organizá, automatizá. 
                <br className="hidden sm:block" />
                Proyecto Emprendedurismo te acompaña en cada fase.
              </p>
            </div>

            {/* Animated Progress Line */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-16">
              <JourneyStep 
                number="1" 
                title="Validar idea" 
                color="from-[#7B61FF] to-[#7B61FF]/70"
                description="Análisis con IA"
              />
              <div className="w-1 sm:w-24 h-12 sm:h-1 bg-gradient-to-b sm:bg-gradient-to-r from-[#7B61FF] to-[#4E9FFF] rounded-full" />
              <JourneyStep 
                number="2" 
                title="Organizar negocio" 
                color="from-[#4E9FFF] to-[#4E9FFF]/70"
                description="Dashboard en tiempo real"
              />
              <div className="w-1 sm:w-24 h-12 sm:h-1 bg-gradient-to-b sm:bg-gradient-to-r from-[#4E9FFF] to-[#3DC67B] rounded-full" />
              <JourneyStep 
                number="3" 
                title="Escalar empresa" 
                color="from-[#3DC67B] to-[#3DC67B]/70"
                description="Automatización completa"
              />
            </div>
          </div>
        </div>
        
        {/* Tres etapas - Grok-style Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Tres etapas, una plataforma
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Elegí tu etapa actual y accedé a herramientas diseñadas específicamente para tus necesidades
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <StageCard
              icon={Rocket}
              badge="DESDE CERO"
              title="Emprendedor"
              subtitle="Tengo una Idea"
              description="Tenés una idea pero no sabés si va a funcionar. Validala con IA y descubrí si puede ser tu próximo gran negocio."
              features={[
                'Lean Canvas interactivo',
                'Simulador financiero con IA',
                'Checklist AFIP',
                'Business plan automático'
              ]}
              buttonText="Empezar Validación 🚀"
              color="#7B61FF"
              onClick={() => navigate('/onboarding/classify?mode=demo')}
            />
            
            <StageCard
              icon={TrendingUp}
              badge="1-3 AÑOS"
              title="Negocio"
              subtitle="Tengo un Negocio"
              description="Ya vendés, pero llevás todo a mano. Ordená finanzas y clientes con datos reales."
              features={[
                'Dashboard en tiempo real',
                'CRM simple y potente',
                'Control de gastos',
                'Facturación AFIP'
              ]}
              buttonText="Organizar Negocio 📊"
              color="#4E9FFF"
              onClick={() => navigate('/onboarding/classify?mode=demo')}
              popular
            />
            
            <StageCard
              icon={BarChart3}
              badge="+3 AÑOS"
              title="PyME / Empresa"
              subtitle="Tengo una Empresa"
              description="Tu empresa creció. Ahora es momento de escalar y automatizar procesos con IA."
              features={[
                'Gestión de equipo',
                'Automatización completa',
                'Multi-sucursal',
                'Reportes ejecutivos'
              ]}
              buttonText="Automatizar Empresa 🧠"
              color="#3DC67B"
              onClick={() => navigate('/onboarding/classify?mode=demo')}
            />
          </div>
        </div>

        {/* Utility Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="bg-background rounded-3xl p-8 sm:p-12 shadow-xl border border-border">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              ¿Qué hace esta plataforma diferente?
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <UtilityCard 
                icon={Gauge}
                title="Automatización local"
                description="Procesos optimizados para el mercado argentino"
              />
              <UtilityCard 
                icon={Brain}
                title="IA entrenada con datos de Argentina"
                description="Decisiones basadas en contexto real"
              />
              <UtilityCard 
                icon={Users}
                title="Enfocado en emprendedores reales"
                description="Herramientas prácticas, no teoría"
              />
              <UtilityCard 
                icon={Shield}
                title="Datos seguros"
                description="Tu información protegida en servidores locales"
              />
            </div>

            <p className="text-center text-muted-foreground mt-12 text-lg">
              Diseñado por emprendedores, para emprendedores.
            </p>
          </div>
        </div>
        
        {/* Final CTA - Powerful */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/20 via-[#4E9FFF]/20 to-[#3DC67B]/20 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-br from-[#7B61FF]/10 to-[#4E9FFF]/10 rounded-3xl p-12 sm:p-16 backdrop-blur-xl border border-white/20 shadow-2xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Empezá gratis hoy mismo
            </h2>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-10">
              Probá todas las funcionalidades sin límites. 
              <br className="hidden sm:block" />
              No necesitás tarjeta de crédito.
            </p>
            <Button
              onClick={() => navigate('/onboarding/classify?mode=demo')}
              size="lg"
              className="px-12 py-7 text-xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#4E9FFF] text-white rounded-2xl shadow-2xl hover:shadow-[#7B61FF]/50 hover:scale-105 transition-all animate-glow-pulse"
            >
              Comenzar Ahora
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="border-t border-border/40 backdrop-blur-xl bg-background/60 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Building2 className="w-4 h-4" />
                <span>© 2025 Proyecto Emprendedurismo • San Luis, Argentina</span>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <button className="hover:text-foreground transition">Términos</button>
                <button className="hover:text-foreground transition">Privacidad</button>
                <button className="hover:text-foreground transition">Soporte</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

interface JourneyStepProps {
  number: string;
  title: string;
  color: string;
  description: string;
}

function JourneyStep({ number, title, color, description }: JourneyStepProps) {
  return (
    <div className="group flex flex-col items-center gap-3 cursor-pointer">
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-2xl shadow-xl group-hover:scale-110 transition-transform`}>
        {number}
      </div>
      <div className="text-center">
        <p className="font-bold text-sm sm:text-base">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
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
  color: string;
  onClick: () => void;
  popular?: boolean;
}

function StageCard({ icon: Icon, badge, title, subtitle, description, features, buttonText, color, onClick, popular }: StageCardProps) {
  return (
    <div 
      className="relative group card-3d bg-background rounded-3xl p-8 border-2 hover:border-opacity-100 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
      style={{ 
        borderColor: `${color}30`,
        background: `linear-gradient(145deg, ${color}05, ${color}10)`
      }}
    >
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
      
      {popular && (
        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg z-10">
          ⭐ MÁS POPULAR
        </Badge>
      )}
      
      <div 
        className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow animate-float"
        style={{ 
          background: `linear-gradient(135deg, ${color}, ${color}CC)` 
        }}
      >
        <Icon className="w-9 h-9 text-white" />
      </div>
      
      <div 
        className="inline-block px-3 py-1 text-xs font-bold rounded-full mb-4"
        style={{ 
          background: `${color}20`,
          color: color 
        }}
      >
        🚀 {badge}
      </div>
      
      <h3 className="text-2xl font-bold mb-1">{title}</h3>
      <p className="text-base font-semibold text-muted-foreground mb-3">{subtitle}</p>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <CheckCircle 
              className="w-4 h-4 mt-0.5 flex-shrink-0" 
              style={{ color: color }}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        onClick={onClick}
        className="w-full text-white font-semibold shadow-lg hover:shadow-xl transition-all group/btn"
        style={{ 
          background: `linear-gradient(135deg, ${color}, ${color}CC)` 
        }}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition" />
      </Button>
    </div>
  );
}

interface UtilityCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function UtilityCard({ icon: Icon, title, description }: UtilityCardProps) {
  return (
    <div className="group p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
