import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// LOGIN MODAL
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-grok-overlay" onClick={onClose}>
      <div className="modal-grok-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-grok-bg" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Entrá a tu cuenta</h2>
            <p className="text-white/90 text-base">Empezá a usar IA para tu negocio en 2 minutos</p>
          </div>
          <div className="space-y-3 mb-6">
            <button
              className="btn-login-grok"
              onClick={() => {
                onClose();
                window.location.href = "/auth?mode=login&provider=google";
              }}
            >
              <span>Continuar con Google</span>
            </button>
            <button
              className="btn-login-grok"
              onClick={() => {
                onClose();
                window.location.href = "/auth?mode=login";
              }}
            >
              <span>Continuar con Email</span>
            </button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/80">¿Primera vez acá?</span>
            </div>
          </div>
          <button
            className="w-full text-center text-white hover:text-white/80 transition-colors font-semibold text-lg"
            onClick={() => {
              onClose();
              window.location.href = "/auth?mode=signup";
            }}
          >
            Crear cuenta gratis
          </button>
          <p className="text-center text-white/60 text-xs mt-8">Sin tarjeta. Sin trucos. Solo empezá.</p>
        </div>
      </div>
    </div>
  );
}

// MAIN INDEX
export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".scroll-fade-in, .fade-in-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const heroTitle = "De la idea a los números en días, no meses".split(" ").map((word, idx) => (
    <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
      {word}{" "}
    </span>
  ));

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="min-h-screen bg-white">
        {/* HEADER */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="font-bold text-sm md:text-base text-foreground hidden xs:block">
                  Proyecto Emprendedurismo
                </span>
              </div>
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors button-hover"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="pb-4 space-y-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center text-base font-semibold min-h-12 button-hover"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => {
                    navigate("/auth?mode=signup");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center bg-primary hover:bg-primary-hover text-white text-base font-semibold py-3 rounded-md min-h-12 button-hover"
                >
                  Crear Cuenta
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate("/select-role");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-center text-base font-semibold min-h-12 button-hover"
                >
                  Ver Demo
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-20 wave-background">
          <div className="slide-left-decoration" />
          <div className="slide-right-decoration" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="badge-glow fade-in mb-8 inline-flex animate-float">
                <Zap className="w-4 h-4" />
                <span>IA que entiende Argentina</span>
              </div>
              <h1 className="gradient-text-animated mb-6 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-cascade">
                {heroTitle}
              </h1>
              <p
                className="text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto fade-in-up"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
              >
                La plataforma que combina IA + automatización + datos para que emprendedores y PyMEs validen ideas,
                organicen operaciones y escalen con confianza.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-12 text-white text-lg fade-in-up">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Sin tarjeta requerida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Datos 100% seguros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Empezá en solo 2 minutos</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up">
                <button className="btn-secondary-glow button-hover" onClick={() => navigate("/select-role")}>
                  Ver Demo
                </button>
                <button className="btn-primary-glow button-hover