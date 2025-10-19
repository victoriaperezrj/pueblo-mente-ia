import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, BarChart3, Building2, Menu, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLHeadingElement>(null);

  // Word-by-word animation for hero
  useEffect(() => {
    if (heroRef.current) {
      const text = heroRef.current.textContent || '';
      const words = text.split(' ');
      heroRef.current.innerHTML = words
        .map((word, i) => `<span class="word-animate" style="animation-delay: ${i * 0.05}s">${word}</span>`)
        .join(' ');
    }
  }, []);

  // Scroll fade-in observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Sticky with backdrop blur */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:block">
                Proyecto Emprendedurismo
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth?mode=login')}
                className="font-semibold"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate('/auth?mode=signup')}
                className="bg-primary text-white font-semibold hover:bg-primary-hover shadow-sm button-hover"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/select-role')}
                className="font-semibold"
              >
                Ver Demo
              </Button>
            </div>

            {/* Mobile menu button */}
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
            <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-5">
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
                className="w-full justify-center bg-gradient-to-r from-[#5B7FFF] to-[#8B5CF6] text-white"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/select-role');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center"
              >
                Ver Demo
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Wave Background */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:py-0 overflow-hidden wave-background">
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/20 scroll-fade-in">
            <span className="text-sm font-semibold text-primary">⚡ IA que entiende Argentina</span>
          </div>

          {/* Headline with word animation */}
          <h1 
            ref={heroRef}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground px-4"
          >
            De la idea a los números en días, no meses
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed scroll-fade-in px-4" style={{ animationDelay: '0.3s' }}>
            ¿Tenés una idea? ¿Un negocio que crece? ¿Una empresa que necesita orden?
            <br className="hidden sm:block" />
            Acá validás, organizás y escalás TODO en un solo lugar.
          </p>

          {/* Micro-benefits */}
          <p className="text-sm text-muted-foreground scroll-fade-in" style={{ animationDelay: '0.5s' }}>
            ✓ Sin tarjeta ✓ Datos seguros ✓ Empezá en 2 min
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 scroll-fade-in" style={{ animationDelay: '0.7s' }}>
            <Button
              size="lg"
              onClick={() => navigate('/auth?mode=signup')}
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary-hover px-8 py-6 text-base sm:text-lg font-semibold rounded-md shadow-sm button-hover min-h-[48px]"
            >
              Comenzar Gratis →
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/select-role')}
              className="w-full sm:w-auto px-7 py-5 text-base sm:text-lg font-semibold rounded-md border-2 hover:bg-muted button-hover min-h-[48px]"
            >
              Ver Demo
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/business-ai-bot')}
              className="w-full sm:w-auto px-8 py-6 text-base sm:text-lg font-semibold rounded-md bg-accent hover:bg-accent/90 text-white button-hover shadow-sm min-h-[48px]"
            >
              Bot IA Empresarial 🤖
            </Button>
          </div>
        </div>
      </section>

      {/* ¿En qué etapa estás? Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 wave-background-subtle">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16 scroll-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              ¿En qué etapa estás?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
            </p>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {/* Card 1 - EMPRENDEDOR */}
            <div className="relative group bg-card rounded-lg p-7 border border-border hover:border-primary/50 transition-all duration-300 shadow-sm card-hover scroll-fade-in">
              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded uppercase tracking-wide">
                    DESDE CERO
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Emprendedor</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ¿Tenés una idea pero no sabés si funciona?
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {['Validá con IA', 'Ves números reales', 'Entendé viabilidad'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-secondary">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate('/select-role')}
                  className="w-full bg-primary hover:bg-primary-hover text-white rounded-md shadow-sm button-hover mt-4 min-h-[48px]"
                >
                  Validar Idea →
                </Button>
              </div>
            </div>

            {/* Card 2 - NEGOCIO (DESTACADA) */}
            <div className="relative group bg-primary/5 rounded-lg p-7 border-2 border-primary transition-all duration-300 shadow-md card-hover scroll-fade-in" style={{ animationDelay: '0.1s' }}>
              {/* Badge "Más Popular" */}
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary rounded text-xs font-bold text-white shadow-sm">
                ⭐ Más Popular
              </div>

              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded uppercase tracking-wide">
                    1-3 AÑOS
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Negocio</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vendés, pero todo a mano. Necesitás ordenar y crecer.
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {['Dashboard real-time', 'CRM simple', 'Control gastos'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-secondary">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate('/select-role')}
                  className="w-full bg-primary hover:bg-primary-hover text-white rounded-md shadow-sm button-hover mt-4 min-h-[48px]"
                >
                  Organizar Negocio →
                </Button>
              </div>
            </div>

            {/* Card 3 - EMPRESA */}
            <div className="relative group bg-card rounded-lg p-7 border border-border hover:border-secondary/50 transition-all duration-300 shadow-sm card-hover scroll-fade-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-4">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded uppercase tracking-wide">
                    +3 AÑOS
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Empresa</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Creció tu empresa. Automatizá y escalá con IA.
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {['Gestión de equipo', 'Automatización', 'Multi-sucursal'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-secondary">
                      <Check className="h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate('/select-role')}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-md shadow-sm button-hover mt-4 min-h-[48px]"
                >
                  Automatizar →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-12 text-center scroll-fade-in">
        <p className="text-sm text-muted-foreground">
          Probá gratis • Sin tarjeta • Datos seguros • Empezá en 2 min
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-sm opacity-80">
            © 2025 Proyecto Emprendedurismo. Todos los derechos reservados.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors duration-200">Términos</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}