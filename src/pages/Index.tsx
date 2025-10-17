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
        {/* GROK Style Header - Sticky with blur */}
        <nav className="backdrop-blur-xl bg-background/80 border-b border-border sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg text-foreground">Proyecto Emprendedurismo</h1>
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
                  className="gradient-primary text-white font-semibold hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-300"
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
              <div className="md:hidden pb-4 space-y-2 animate-scale-in">
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
        
        {/* Hero Section - GROK Style with animated blobs */}
        <section className="relative min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden py-20">
          {/* GROK Animated gradient background with blobs */}
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/40" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-float-up">
            {/* Badge - Centered */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm mx-auto">
              <Zap className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">⚡ IA que entiende Argentina</span>
            </div>

            {/* Title - GROK Style Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-center">
              <span className="text-white">
                De la idea a los números en días,
              </span>
              <br />
              <span className="text-white/90">no meses</span>
            </h1>

            {/* Subtitle - Centered, legible */}
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed text-center px-4">
              ¿Tenés una idea? ¿Un negocio que crece? ¿Una empresa que necesita orden?
              <br className="hidden sm:block" />
              Acá validás, organizás y escalás TODO en un solo lugar.
            </p>

            {/* Highlight - Badge style */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mx-auto">
              <span className="text-sm text-white/90">Números que tienen sentido</span>
            </div>

            {/* CTAs - Centered, GROK style buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-3xl mx-auto px-4">
              <Button
                size="lg"
                onClick={() => navigate('/demo/intro')}
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-8 py-6 text-base sm:text-lg rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group font-semibold"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/business-ai-bot')}
                className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 font-semibold shadow-xl hover:shadow-2xl"
              >
                Bot IA Empresarial 🤖
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg rounded-lg bg-white/15 border-2 border-white hover:bg-white/25 text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 font-semibold"
              >
                Ver Demo
              </Button>
            </div>

            {/* Micro-benefits - Centered */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white/80 w-full max-w-2xl mx-auto pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Sin tarjeta • Datos seguros • Empezá en 2 min</span>
              </div>
            </div>
          </div>
        </section>

        {/* ¿EN QUÉ ETAPA ESTÁS? Section - GROK Style */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                ¿En qué etapa estás?
              </h2>
              <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Emprendedor Card - Azul profesional */}
              <div className="relative group bg-card rounded-xl p-7 border border-border hover:border-primary/50 transition-all duration-300 shadow-base hover:shadow-hover card-3d">
                <div className="space-y-4">
                  {/* Icon & Label */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                      <Rocket className="h-7 w-7 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-foreground/5 text-foreground/60 text-xs font-semibold rounded uppercase tracking-wide">
                      DESDE CERO
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground">Emprendedor</h3>
                  
                  {/* Problem */}
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Sabés que te falta un dato: ¿Va a funcionar?
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {['Validá con IA', 'Ves números reales', 'Entendé viabilidad'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-success">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => navigate('/demo/intro')}
                    className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group mt-4"
                  >
                    Validar Idea →
                  </Button>
                </div>
              </div>

              {/* Negocio Card - DESTACADA con badge perfecto */}
              <div className="relative group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-7 border-2 border-primary transition-all duration-300 shadow-lg hover:shadow-xl card-3d">
                {/* Badge "Más Popular" - Posicionado perfecto */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary rounded text-xs font-bold text-white shadow-md">
                  ⭐ Más Popular
                </div>

                <div className="space-y-4">
                  {/* Icon & Label */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                      <BarChart3 className="h-7 w-7 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded uppercase tracking-wide">
                      1-3 AÑOS
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground">Negocio</h3>
                  
                  {/* Problem */}
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Vendés, pero todo a mano. Necesitás ordenar y crecer.
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {['Dashboard real-time', 'CRM simple', 'Control gastos'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-success">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => navigate('/demo/intro')}
                    className="w-full bg-primary hover:bg-primary-hover text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group mt-4"
                  >
                    Organizar Negocio →
                  </Button>
                </div>
              </div>

              {/* PyME Card - Verde natural */}
              <div className="relative group bg-card rounded-xl p-7 border border-border hover:border-success/50 transition-all duration-300 shadow-base hover:shadow-hover card-3d md:col-span-2 lg:col-span-1">
                <div className="space-y-4">
                  {/* Icon & Label */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-white" />
                    </div>
                    <span className="px-3 py-1 bg-foreground/5 text-foreground/60 text-xs font-semibold rounded uppercase tracking-wide">
                      +3 AÑOS
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground">Empresa</h3>
                  
                  {/* Problem */}
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    Creció tu empresa. Automatizá y escalá con IA.
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {['Gestión de equipo', 'Automatización', 'Multi-sucursal'].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-success">
                        <Check className="h-4 w-4 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => navigate('/demo/intro')}
                    className="w-full bg-success hover:bg-success/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group mt-4"
                  >
                    Automatizar →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ¿QUÉ NOS HACE DIFERENTES? Section - GROK Style */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                ¿Qué nos hace diferentes?
              </h2>
              <p className="text-base text-foreground/60">
                Diseñado por emprendedores que cometieron tus mismos errores
              </p>
            </div>

            {/* LO QUE NO HACEMOS */}
            <div className="mb-10">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                  { text: 'No vendemos templates' },
                  { text: 'No consultorías caras' },
                  { text: 'No cursos teóricos' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-lg p-5 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="text-2xl mb-2">❌</div>
                    <p className="text-sm text-foreground/70 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-border mb-10"></div>

            {/* LO QUE SÍ HACEMOS */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
                ✅ Vendemos claridad
              </h3>
              
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="pl-6 border-l-2 border-primary">
                  <h4 className="font-semibold text-foreground mb-1">→ IA que entiende Argentina</h4>
                  <p className="text-sm text-foreground/70">
                    No copiamos modelos de USA. Inflación, monotributo, AFIP, todo calibrado.
                  </p>
                </div>

                <div className="pl-6 border-l-2 border-primary">
                  <h4 className="font-semibold text-foreground mb-1">→ Números que tienen sentido</h4>
                  <p className="text-sm text-foreground/70">
                    No te mostramos gráficos bonitos. Te decimos si funciona o no, y por qué.
                  </p>
                </div>

                <div className="pl-6 border-l-2 border-primary">
                  <h4 className="font-semibold text-foreground mb-1">→ Herramientas por emprendedores</h4>
                  <p className="text-sm text-foreground/70">
                    Diseñadas por gente que cometió los mismos errores que estás a punto de cometer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final Section - GROK Style */}
        <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative gradient-cta rounded-2xl p-10 sm:p-16 shadow-2xl overflow-hidden text-center">
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Probá gratis
                </h2>
                <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto">
                  Sin sorpresas. Sin tarjeta. Sin restricciones.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => navigate('/demo/intro')}
                    className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group"
                  >
                    Empezar Ahora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="bg-white/15 border-2 border-white hover:bg-white/25 text-white backdrop-blur-sm px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    Agendar Demo
                  </Button>
                </div>

                <p className="text-xs text-white/80 pt-4">
                  Acceso completo • No hay restricciones
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - GROK Style */}
        <footer className="bg-foreground text-white py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start gap-2">
                <p className="font-semibold">© 2025 Proyecto Emprendedurismo</p>
                <p className="text-sm text-white/60">San Luis, Argentina</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
                <button className="text-white/80 hover:text-white transition-colors">Términos</button>
                <button className="text-white/80 hover:text-white transition-colors">Privacidad</button>
                <button className="text-white/80 hover:text-white transition-colors">Soporte</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}