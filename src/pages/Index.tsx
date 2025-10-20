import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, BarChart3, Building2, Menu, X, Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for tilt effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Typewriter effect for hero text
  useEffect(() => {
    if (heroRef.current) {
      const text = "De la idea a los números en días, no meses";
      let index = 0;
      heroRef.current.textContent = "";

      const typeWriter = setInterval(() => {
        if (index < text.length) {
          heroRef.current!.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(typeWriter);
        }
      }, 50);

      return () => clearInterval(typeWriter);
    }
  }, []);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Ambient floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="floating-particle"
          style={{
            left: "10%",
            top: "20%",
            animationDelay: "0s",
            width: "150px",
            height: "150px",
          }}
        ></div>
        <div
          className="floating-particle"
          style={{
            right: "15%",
            top: "60%",
            animationDelay: "2s",
            width: "200px",
            height: "200px",
          }}
        ></div>
        <div
          className="floating-particle"
          style={{
            left: "70%",
            bottom: "10%",
            animationDelay: "4s",
            width: "120px",
            height: "120px",
          }}
        ></div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          HEADER GLASSMORPHISM
          ════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with glow */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-glow magnetic-button">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-900 hidden xs:block gradient-text-hover">
                Proyecto Emprendedurismo
              </span>
            </div>

            {/* Desktop Navigation with glow buttons */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth?mode=login")}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 magnetic-button hover:scale-105"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate("/auth?mode=signup")}
                className="btn-primary-glow text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/select-role")}
                className="text-sm font-semibold border-gray-300 hover:bg-gray-50 transition-all duration-300 magnetic-button hover:scale-105"
              >
                Ver Demo
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors magnetic-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>

          {/* Mobile menu glassmorphism */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4 fade-in">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/auth?mode=login");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center text-base font-semibold"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => {
                  navigate("/auth?mode=signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center btn-primary-glow text-base font-semibold"
              >
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/select-role");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center text-base font-semibold"
              >
                Ver Demo
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════════
          HERO SECTION - GRADIENT EXPLOSIVO + TEXTO LEGIBLE
          ════════════════════════════════════════════════════════════════ */}
      <section className="hero-gradient-bg relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 md:pt-24 md:pb-0">
        {/* Glassmorphism overlay para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none"></div>

        {/* Aurora waves effect */}
        <div className="aurora-wave"></div>

        {/* Hero Content con glassmorphism */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 md:space-y-8 pt-16 md:pt-0">
          {/* Badge con glow */}
          <div className="badge-glow fade-in-up inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-semibold">IA que entiende Argentina</span>
          </div>

          {/* Headline con typewriter effect */}
          <div
            className="glassmorphism-card-hero p-8 md:p-12 rounded-3xl fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h1
              ref={heroRef}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6 text-shadow-glow typewriter"
            >
              {/* Texto se genera con efecto typewriter */}
            </h1>

            {/* Subtítulo con gradient */}
            <p
              className="text-xl md:text-2xl lg:text-3xl text-white/95 font-medium leading-relaxed mb-8 fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              La plataforma que combina{" "}
              <span className="gradient-text-animated font-bold">IA + automatización + datos</span> para que
              emprendedores y PyMEs validen, organicen y escalen
            </p>

            {/* CTA Buttons con efectos */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                onClick={() => navigate("/select-role")}
                className="btn-primary-glow w-full sm:w-auto min-w-[200px]"
              >
                🚀 Ver Demo
              </button>
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="btn-secondary-glow w-full sm:w-auto min-w-[200px]"
              >
                Crear Cuenta Gratis
              </button>
            </div>
          </div>

          {/* Stats con morphing cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mt-12 fade-in-up" style={{ animationDelay: "0.8s" }}>
            {[
              { label: "Emprendedores", value: "500+", icon: Rocket },
              { label: "Ideas Validadas", value: "1,200+", icon: Sparkles },
              { label: "Satisfacción", value: "98%", icon: Zap },
            ].map((stat, idx) => (
              <div key={idx} className="glassmorphism-card p-4 md:p-6 text-center morphing-card group">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-white group-hover:scale-110 transition-transform" />
                <p className="text-2xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-white/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator con animación */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          CARDS SECTION - TILT 3D + GLASSMORPHISM
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header con scroll reveal */}
          <div className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-16 scroll-reveal">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              ¿En qué etapa estás?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
            </p>
          </div>

          {/* 3 Cards Grid con efectos 3D */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            {/* Card 1 - EMPRENDEDOR */}
            <div className="tilt-card scroll-reveal" style={{ animationDelay: "0.1s" }}>
              <div className="relative group bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-blue-400 transition-all duration-500 shadow-xl hover:shadow-2xl card-glow-blue h-full">
                <div className="space-y-5 sm:space-y-6">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 magnetic-button group-hover:scale-110 transition-transform shadow-glow">
                      <Rocket className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider flex-shrink-0 border-2 border-blue-200">
                      DESDE CERO
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Emprendedor
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    ¿Tenés una idea pero no sabés si funciona?
                  </p>

                  {/* Features con check animados */}
                  <ul className="space-y-3">
                    {["Validá con IA", "Ves números reales", "Entendé viabilidad"].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-gray-700 group/item">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button con ripple effect */}
                  <Button
                    onClick={() => navigate("/select-role")}
                    className="w-full btn-primary-glow text-base font-semibold mt-4"
                  >
                    Validar Idea →
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 2 - NEGOCIO (HIGHLIGHTED) */}
            <div className="tilt-card scroll-reveal" style={{ animationDelay: "0.2s" }}>
              <div className="relative group bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 card-glow-purple h-full scale-105 md:scale-110">
                {/* Badge "Más Popular" con brillo */}
                <div className="absolute -top-3 sm:-top-4 right-4 sm:right-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl pulse-glow">
                  ⭐ Más Popular
                </div>

                <div className="space-y-5 sm:space-y-6">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 magnetic-button group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                    </div>
                    <span className="px-3 py-1.5 bg-purple-800 text-white text-xs font-bold rounded-full uppercase tracking-wider flex-shrink-0">
                      1-3 AÑOS
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Negocio</h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                    Vendés, pero todo a mano. Necesitás ordenar y crecer.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {["Dashboard real-time", "CRM simple", "Control gastos"].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-purple-50 group/item">
                        <Check className="h-5 w-5 text-green-300 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => navigate("/select-role")}
                    className="w-full bg-white hover:bg-purple-50 text-purple-600 rounded-xl py-3 sm:py-3.5 text-base font-semibold shadow-xl transition-all duration-300 mt-4 magnetic-button hover:scale-105"
                  >
                    Organizar Negocio →
                  </Button>
                </div>
              </div>
            </div>

            {/* Card 3 - EMPRESA */}
            <div className="tilt-card scroll-reveal" style={{ animationDelay: "0.3s" }}>
              <div className="relative group bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-green-400 transition-all duration-500 shadow-xl hover:shadow-2xl card-glow-green h-full">
                <div className="space-y-5 sm:space-y-6">
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 magnetic-button group-hover:scale-110 transition-transform shadow-glow">
                      <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <span className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-full uppercase tracking-wider flex-shrink-0 border-2 border-green-200">
                      +3 AÑOS
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Empresa
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Creció tu empresa. Automatizá y escalá con IA.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {["Gestión de equipo", "Automatización", "Multi-sucursal"].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm sm:text-base text-gray-700 group/item">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    onClick={() => navigate("/select-role")}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl py-3 sm:py-3.5 text-base font-semibold shadow-xl transition-all duration-300 mt-4 magnetic-button hover:scale-105"
                  >
                    Automatizar →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          FOOTER CON GLASSMORPHISM
          ════════════════════════════════════════════════════════════════ */}
      <footer className="glassmorphism-footer text-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              © 2025 Proyecto Emprendedurismo. Todos los derechos reservados.
            </p>
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 magnetic-button">
                Términos
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 magnetic-button">
                Privacidad
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 magnetic-button">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
