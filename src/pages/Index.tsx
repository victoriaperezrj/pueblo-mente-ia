import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Target, Zap, ArrowRight, Check, 
  Building2, Rocket, BarChart3, Sparkles, Brain, Users,
  Shield, Gauge, Menu, X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import LocalIA from '@/components/LocalIA';

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

  const journeySteps = [
    {
      icon: Rocket,
      title: 'Validar idea',
      description: 'Análisis con IA',
      color: 'bg-primary'
    },
    {
      icon: Target,
      title: 'Organizar negocio',
      description: 'Dashboard en tiempo real',
      color: 'bg-secondary'
    },
    {
      icon: TrendingUp,
      title: 'Escalar empresa',
      description: 'Automatización completa',
      color: 'bg-success'
    }
  ];
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* LocalIA integration */}
      <LocalIA />
      
      <div className="relative z-10">
        {/* Modern Header */}
        <nav className="backdrop-blur-xl bg-background/80 border-b border-border sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg animate-float">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg text-foreground">Proyecto Emprendedurismo</h1>
                  <p className="text-xs text-foreground/60">Tu ecosistema empresarial completo</p>
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
                  className="gradient-primary text-white font-semibold hover:opacity-90 shadow-lg"
                >
                  Crear Cuenta
                </Button>
              </div>

              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-2 animate-scale-in">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate('/auth?mode=login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => {
                    navigate('/auth?mode=signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center gradient-primary text-white"
                >
                  Crear Cuenta
                </Button>
              </div>
            )}
          </div>
        </nav>
        
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated gradient background - Nueva paleta neutral */}
          <div className="absolute inset-0 gradient-hero animate-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
          
          {/* Floating particles effect - Colores actualizados */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge - Centrado con amarillo */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-glow-pulse mx-auto">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Potenciado con IA Argentina</span>
            </div>

            {/* Title - Centrado con texto legible sin borrosidad */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-center">
              <span className="bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                Tu negocio,
              </span>
              <br />
              <span className="text-foreground">del plan a la acción</span>
            </h1>

            {/* Subtitle - Centrado con tamaño mínimo 16px */}
            <p className="text-base sm:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed text-center px-4">
              Ecosistema inteligente para emprendedores argentinos. 
              <br className="hidden sm:block" />
              Validá ideas, ordená números y automatizá tu empresa con IA local.
            </p>

            {/* Micro-benefits - Centrados responsive */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-foreground/70 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Check className="h-4 w-4 text-success" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Check className="h-4 w-4 text-success" />
                <span>Gratis para empezar</span>
              </div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Check className="h-4 w-4 text-success" />
                <span>Datos seguros en Argentina</span>
              </div>
            </div>

            {/* CTAs - Centrados responsive con animaciones visibles */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-2xl mx-auto px-4">
              <Button
                size="lg"
                onClick={() => navigate('/demo/intro')}
                className="w-full sm:w-auto gradient-primary text-primary-foreground px-8 py-6 text-base sm:text-lg rounded-full shadow-lg hover:shadow-glow animate-glow-pulse hover:scale-105 transition-all duration-300 group"
              >
                Explorar Demo Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg rounded-full border-2 hover:bg-secondary/10 hover:border-secondary transition-all duration-300 hover:scale-105"
              >
                Crear Cuenta
              </Button>
            </div>
          </div>
        </section>

        {/* Camino del Emprendedor Section */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 sm:mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Camino del Emprendedor
              </h2>
              <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed px-4">
                Crecé paso a paso: validá, organizá, automatizá. 
                <br className="hidden sm:block" />
                Proyecto Emprendedurismo te acompaña en cada fase.
              </p>
            </div>

            {/* Journey Steps - Responsive y centrado */}
            <div className="relative">
              {/* Connecting line - Visible en desktop */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-success -translate-y-1/2 hidden lg:block opacity-50" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative px-4 sm:px-0">
                {journeySteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative group animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-card rounded-[20px] p-6 sm:p-8 shadow-base hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border border-border hover:border-opacity-50 card-3d">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${step.color} flex items-center justify-center mb-4 sm:mb-6 mx-auto animate-glow-pulse`}>
                        <step.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-center text-foreground">{step.title}</h3>
                      <p className="text-sm sm:text-base text-foreground/70 text-center leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tres Etapas, Una Plataforma Section */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12 sm:mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Tres Etapas, Una Plataforma
              </h2>
              <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed px-4">
                Elegí tu etapa y accedé a herramientas diseñadas para ti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Emprendedor Card - Amarillo suave */}
              <div className="relative group card-3d bg-card rounded-[20px] p-6 sm:p-8 border-2 border-primary/20 hover:border-primary transition-all duration-300 shadow-base hover:shadow-hover overflow-hidden">
                <div className="absolute inset-0 gradient-emprendedor opacity-5" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary flex items-center justify-center animate-float">
                      <Rocket className="h-6 w-6 sm:h-7 sm:w-7 text-foreground" />
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                      DESDE CERO
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Emprendedor</h3>
                    <p className="text-sm text-foreground/60 mb-4">Tengo una Idea</p>
                    <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6">
                      Tenés una idea pero no sabés si funciona. Validala con IA antes de invertir.
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {['Lean Canvas interactivo', 'Análisis IA', 'Simulador financiero', 'Checklist AFIP'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate('/demo/intro')}
                    className="w-full bg-primary hover:bg-primary-hover text-foreground rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    Empezar Validación 🚀
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Negocio Card - Azul claro */}
              <div className="relative group card-3d bg-card rounded-[20px] p-6 sm:p-8 border-2 border-secondary/20 hover:border-secondary transition-all duration-300 shadow-base hover:shadow-hover overflow-hidden">
                <div className="absolute inset-0 gradient-negocio opacity-5" />
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-foreground shadow-lg animate-bounce-subtle border border-secondary/20">
                  Más Popular
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center animate-float">
                      <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full border border-secondary/20">
                      1-3 AÑOS
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Negocio</h3>
                    <p className="text-sm text-foreground/60 mb-4">Tengo un Negocio</p>
                    <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6">
                      Ya vendés, pero todo a mano. Ordená finanzas y clientes con datos reales.
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {['Dashboard real-time', 'CRM simple', 'Control gastos', 'Facturación AFIP'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate('/demo/intro')}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    Organizar Negocio 📊
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* PyME Card - Verde suave */}
              <div className="relative group card-3d bg-card rounded-[20px] p-6 sm:p-8 border-2 border-success/20 hover:border-success transition-all duration-300 shadow-base hover:shadow-hover overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 gradient-pyme opacity-5" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-success flex items-center justify-center animate-float">
                      <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full border border-success/20">
                      +3 AÑOS
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">PyME / Empresa</h3>
                    <p className="text-sm text-foreground/60 mb-4">Tengo una Empresa</p>
                    <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-6">
                      Tu empresa creció. Automatizá y escalá con IA.
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {['Gestión equipo', 'Automatización', 'Multi-sucursal', 'Reportes ejecutivos'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => navigate('/demo/intro')}
                    className="w-full bg-success hover:bg-success/90 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 group"
                  >
                    Automatizar Empresa 🧠
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Qué hace diferente Section */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16 text-foreground">
              ¿Qué hace esta plataforma diferente?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="bg-card rounded-[20px] p-6 shadow-base hover:shadow-hover transition-all duration-300 hover:-translate-y-2 hover-lift border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Gauge className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Automatización local</h3>
                <p className="text-sm text-foreground/70">Procesos optimizados para el mercado argentino</p>
              </div>

              <div className="bg-card rounded-[20px] p-6 shadow-base hover:shadow-hover transition-all duration-300 hover:-translate-y-2 hover-lift border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">IA con datos argentinos</h3>
                <p className="text-sm text-foreground/70">Decisiones basadas en contexto real</p>
              </div>

              <div className="bg-card rounded-[20px] p-6 shadow-base hover:shadow-hover transition-all duration-300 hover:-translate-y-2 hover-lift border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Por emprendedores</h3>
                <p className="text-sm text-foreground/70">Herramientas prácticas, no teoría</p>
              </div>

              <div className="bg-card rounded-[20px] p-6 shadow-base hover:shadow-hover transition-all duration-300 hover:-translate-y-2 hover-lift border border-border text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground">Asistente LocalIA</h3>
                <p className="text-sm text-foreground/70">Copiloto inteligente integrado</p>
              </div>
            </div>

            <p className="text-center text-base sm:text-lg text-foreground/70 mt-12 px-4">
              Diseñado por emprendedores, para emprendedores.
            </p>
          </div>
        </section>

        {/* CTA Final Section */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative gradient-negocio rounded-[20px] p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-success/20 to-primary/20 animate-gradient" />
              
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Empezá gratis hoy mismo
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
                  Probá todas las funcionalidades sin límites.
                  <br className="hidden sm:block" />
                  No necesitás tarjeta de crédito.
                </p>
                
                <Button
                  size="lg"
                  onClick={() => navigate('/demo/intro')}
                  className="bg-white text-secondary hover:bg-white/90 px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg lg:text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group animate-glow-pulse mx-auto"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2 text-foreground/60 text-sm">
                <Building2 className="w-4 h-4" />
                <span>© 2025 Proyecto Emprendedurismo • San Luis, Argentina</span>
              </div>
              <div className="flex gap-6 text-sm text-foreground/60">
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
