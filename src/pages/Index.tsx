import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Building2, Menu, X, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// ══════════════════════════════════════════════════════════════════════
// LOGIN MODAL COMPONENT - Estilo Grok
// ══════════════════════════════════════════════════════════════════════
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-grok-overlay" onClick={onClose}>
      <div className="modal-grok-container" onClick={(e) => e.stopPropagation()}>
        {/* Fondo animado estilo Grok */}
        <div className="modal-grok-bg" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido */}
        <div className="relative z-10">
          {/* Logo o título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <span className="text-3xl">⚡</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Ingresá a tu cuenta</h2>
            <p className="text-white/70 text-sm">Elegí tu método preferido para continuar</p>
          </div>

          {/* Botones de login */}
          <div className="space-y-3 mb-6">
            {/* Google */}
            <button
              className="btn-login-grok"
              onClick={() => {
                onClose();
                window.location.href = "/auth?mode=login&provider=google";
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            {/* Email */}
            <button
              className="btn-login-grok"
              onClick={() => {
                onClose();
                window.location.href = "/auth?mode=login";
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Continuar con Email</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60">¿No tenés cuenta?</span>
            </div>
          </div>

          {/* Link a registro */}
          <button
            className="w-full text-center text-white/80 hover:text-white transition-colors font-semibold"
            onClick={() => {
              onClose();
              window.location.href = "/auth?mode=signup";
            }}
          >
            Registrarse
          </button>

          {/* Footer con efectos */}
          <p className="text-center text-white/50 text-xs mt-8">Al continuar aceptás nuestros Términos y Privacidad</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN INDEX COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
          HEADER STICKY
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
                onClick={() => setShowLoginModal(true)}
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
                  setShowLoginModal(true);
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
          HERO SECTION - REDISEÑADO CON GRADIENTE EXPLOSIVO
          ════════════════════════════════════════════════════════════════ */}
      <section className="hero-gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Efectos laterales decorativos */}
        <div className="slide-left-decoration" />
        <div className="slide-right-decoration" />
        <div className="floating-particles-left" />
        <div className="floating-particles-right" />

        {/* Contenido principal */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge superior */}
            <div className="badge-glow fade-in mb-8 inline-flex">
              <Zap className="w-4 h-4" />
              <span>IA que entiende Argentina</span>
            </div>

            {/* Título principal */}
            <h1 className="gradient-text-animated fade-in-up mb-6">De la idea a los números en días, no meses</h1>

            {/* Descripción */}
            <p className="text-white/90 text-xl md:text-2xl mb-4 fade-in-up" style={{ animationDelay: "0.1s" }}>
              ¿Tenés una idea? ¿Un negocio que crece? ¿Una empresa que necesita orden?
            </p>
            <p className="text-white/80 text-lg md:text-xl mb-12 fade-in-up" style={{ animationDelay: "0.2s" }}>
              Acá validás, organizás y escalás TODO en un solo lugar.
            </p>

            {/* Features rápidos */}
            <div
              className="flex flex-wrap justify-center gap-8 mb-12 text-white/80 fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Sin tarjeta</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Datos seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Empezá en 2 min</span>
              </div>
            </div>

            {/* 2 BOTONES PRINCIPALES */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              {/* Botón 1: Probar Demo */}
              <button className="btn-secondary-glow" onClick={() => navigate("/select-role")}>
                Ver Demo
              </button>

              {/* Botón 2: Iniciar Sesión */}
              <button className="btn-primary-glow" onClick={() => setShowLoginModal(true)}>
                Iniciar Sesión →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          CARDS SECTION - ¿En qué etapa estás?
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
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
                    <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
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

      {/* ═════════════════════════════════════════════════════════════════
          BOT WIDGET FLOTANTE - LATERAL
          ════════════════════════════════════════════════════════════════ */}
      <div className="bot-widget-float">
        <span className="text-3xl">🤖</span>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          MODAL LOGIN ESTILO GROK
          ════════════════════════════════════════════════════════════════ */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
