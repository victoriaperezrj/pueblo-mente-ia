import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BarChart3, Building2, Menu, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLHeadingElement>(null);

  // Word-by-word animation for hero
  useEffect(() => {
    if (heroRef.current) {
      const text = heroRef.current.textContent || "";
      const words = text.split(" ");
      heroRef.current.innerHTML = words
        .map((word, i) => `<span class="word-animate" style="animation-delay: ${i * 0.05}s">${word}</span>`)
        .join(" ");
    }
  }, []);

  // Scroll fade-in observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".scroll-fade-in").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ═════════════════════════════════════════════════════════════════
          HEADER STICKY - Always accessible
          ════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-900 hidden xs:block">
                Proyecto Emprendedurismo
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth?mode=login")}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors min-h-10"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate("/auth?mode=signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-md shadow-sm transition-all duration-200 button-hover min-h-10"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/select-role")}
                className="text-sm font-semibold border-gray-300 hover:bg-gray-50 transition-colors min-h-10"
              >
                Ver Demo
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/auth?mode=login");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center text-base font-semibold min-h-12"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => {
                  navigate("/auth?mode=signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-3 rounded-md min-h-12"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/select-role");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center text-base font-semibold min-h-12"
              >
                Ver Demo
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════════
          HERO SECTION - Wave Background + Word Animation
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:pt-24 md:pb-0 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white wave-background">
        {/* Decorative waves */}
        <div className="absolute inset-0 z-0">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="blur">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
              </filter>
            </defs>
            <path
              d="M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z"
              fill="#2563EB"
              filter="url(#blur)"
              className="animate-wave"
            />
            <path
              d="M0,350 Q300,300 600,350 T1200,350 L1200,600 L0,600 Z"
              fill="#2563EB"
              filter="url(#blur)"
              opacity="0.6"
              className="animate-wave"
              style={{ animationDelay: "1s" }}
            />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 md:space-y-8 pt-16 md:pt-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-blue-50 border border-blue-200 scroll-fade-in">
            <span className="text-xs sm:text-sm font-semibold text-blue-600">⚡ IA que entiende Argentina</span>
          </div>

          {/* Headline with word animation */}
          <h1
            ref={heroRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 px-2 sm:px-4"
          >
            De la idea a los números en días, no meses
          </h1>

          {/* Subtitle */}
          <p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed scroll-fade-in px-2 sm:px-4"
            style={{ animationDelay: "0.3s" }}
          >
            ¿Tenés una idea? ¿Un negocio que crece? ¿Una empresa que necesita orden?
            <br className="hidden sm:block" />
            Acá validás, organizás y escalás TODO en un solo lugar.
          </p>

          {/* Micro-benefits */}
          <p
            className="text-xs sm:text-sm text-gray-500 scroll-fade-in font-medium tracking-wide"
            style={{ animationDelay: "0.5s" }}
          >
            ✓ Sin tarjeta • ✓ Datos seguros • ✓ Empezá en 2 min
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 scroll-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 button-hover min-h-12 sm:min-h-[52px]"
            >
              Comenzar Gratis →
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/select-role")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200 button-hover min-h-12 sm:min-h-[52px]"
            >
              Ver Demo
            </Button>
            <Button
              onClick={() => navigate("/business-ai-bot")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200 button-hover min-h-12 sm:min-h-[52px]"
            >
              Bot IA 🤖
            </Button>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          ETAPAS SECTION - 3 Cards with Hover Effects
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white wave-background-subtle">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 scroll-fade-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              ¿En qué etapa estás?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
            </p>
          </div>

          {/* 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 mt-12 sm:mt-16">
            {/* Card 1 - EMPRENDEDOR */}
            <div className="relative group bg-white rounded-xl p-6 sm:p-8 border border-gray-200 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-xl card-hover scroll-fade-in">
              <div className="space-y-5 sm:space-y-6">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                    <Rocket className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                    DESDE CERO
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Emprendedor</h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  ¿Tenés una idea pero no sabés si funciona?
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {["Validá con IA", "Ves números reales", "Entendé viabilidad"].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate("/select-role")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 sm:py-3.5 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 button-hover mt-4 min-h-12"
                >
                  Validar Idea →
                </Button>
              </div>
            </div>

            {/* Card 2 - NEGOCIO (HIGHLIGHTED) */}
            <div
              className="relative group bg-blue-600 rounded-xl p-6 sm:p-8 border-2 border-blue-600 shadow-lg hover:shadow-2xl card-hover scroll-fade-in transition-all duration-300"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Badge "Más Popular" */}
              <div className="absolute -top-3 sm:-top-4 right-4 sm:right-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg text-xs sm:text-sm font-bold text-blue-600 shadow-md">
                ⭐ Más Popular
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                  <span className="px-3 py-1.5 bg-blue-700 text-white text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                    1-3 AÑOS
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white">Negocio</h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                  Vendés, pero todo a mano. Necesitás ordenar y crecer.
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {["Dashboard real-time", "CRM simple", "Control gastos"].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-blue-50">
                      <Check className="h-5 w-5 text-green-300 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate("/select-role")}
                  className="w-full bg-white hover:bg-blue-50 text-blue-600 rounded-lg py-3 sm:py-3.5 text-base font-semibold shadow-md transition-all duration-200 button-hover mt-4 min-h-12"
                >
                  Organizar Negocio →
                </Button>
              </div>
            </div>

            {/* Card 3 - EMPRESA */}
            <div
              className="relative group bg-white rounded-xl p-6 sm:p-8 border border-gray-200 hover:border-green-400 transition-all duration-300 shadow-sm hover:shadow-xl card-hover scroll-fade-in md:col-span-3 lg:col-span-1"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="space-y-5 sm:space-y-6">
                {/* Icon & Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wider flex-shrink-0">
                    +3 AÑOS
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Empresa</h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Creció tu empresa. Automatizá y escalá con IA.
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {["Gestión de equipo", "Automatización", "Multi-sucursal"].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Button
                  onClick={() => navigate("/select-role")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 sm:py-3.5 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 button-hover mt-4 min-h-12"
                >
                  Automatizar →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © 2025 Proyecto Emprendedurismo. Todos los derechos reservados.
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
