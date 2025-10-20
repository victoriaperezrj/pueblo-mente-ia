import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Check,
  Zap,
  Briefcase,
  TrendingUp,
  MessageCircle, // Icono para el Chatbot/Asistente
} from "lucide-react";
import { Button } from "@/components/ui/button";

// LOGIN MODAL (Mantenemos el diseño mejorado)
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-2xl pulse-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Entrá a tu cuenta</h2>
            <p className="text-white/90 text-base">Empezá a usar IA para tu negocio en 2 minutos</p>
          </div>
          <div className="space-y-3 mb-6">
            <button
              className="btn-login-grok magnetic-button"
              onClick={() => {
                onClose();
                window.location.href = "/auth?mode=login&provider=google";
              }}
            >
              <span>Continuar con Google</span>
            </button>
            <button
              className="btn-login-grok magnetic-button"
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

// COMPONENTE DE TARJETA DE ETAPA (Diseño limpio con bordes y hover)
interface StageCardProps {
  title: string;
  stageLabel: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  buttonText: string;
  buttonColor: string; // Color para el botón y los checks
  tagColor: string;
  tagText: string;
}

function StageCard({
  title,
  stageLabel,
  icon: Icon,
  description,
  features,
  buttonText,
  buttonColor,
  tagColor,
  tagText,
}: StageCardProps) {
  const isSpecialTag = tagText === "Más Elegido";

  return (
    <div className="stage-card-grok scroll-fade-in hover-scale-grok p-6 md:p-8 flex flex-col h-full border border-gray-200">
      <div className="relative mb-6">
        <div
          className={`stage-tag absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-full ${isSpecialTag ? "bg-accent text-white shadow-lg animate-pulse-slow" : "bg-gray-100 text-gray-600"}`}
        >
          {tagText}
        </div>

        {/* Icono Principal */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${buttonColor} bg-opacity-10`}
          style={{ color: buttonColor }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-foreground mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-foreground/80">
            <Check className={`w-5 h-5 flex-shrink-0 mr-2`} style={{ color: buttonColor }} />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button
          className={`w-full text-base font-semibold py-3 button-hover magnetic-button`}
          style={{ backgroundColor: buttonColor, color: "white" }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

// COMPONENTE FLOTANTE DE ASISTENTE (Chatbot/Ayuda)
function ChatbotFAB() {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-tertiary text-white shadow-xl flex items-center justify-center glow-pulse-chatbot magnetic-button"
      title="Asistente de IA (Chatbot)"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}

// MAIN INDEX
export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll Reveal Logic (Mejorado)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" },
    );
    document.querySelectorAll(".scroll-fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Tilt 3D Effect Logic (para botones principales)
  useEffect(() => {
    const buttons = document.querySelectorAll(".magnetic-button");
    buttons.forEach((button) => {
      const handleMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 5; // Más sensible en botones
        const rotateY = (x - centerX) / 5;

        (button as HTMLElement).style.transform =
          `scale(1.05) translateX(${(x - centerX) * 0.1}px) translateY(${(y - centerY) * 0.1}px)`;
      };

      const handleLeave = () => {
        (button as HTMLElement).style.transform = "scale(1)";
      };

      // Solo aplica el efecto a los botones del hero/header, no a los de las tarjetas
      if (button.closest("section") || button.closest("nav")) {
        button.addEventListener("mousemove", handleMove as EventListener);
        button.addEventListener("mouseleave", handleLeave);
      }

      return () => {
        button.removeEventListener("mousemove", handleMove as EventListener);
        button.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  // Texto Animado en Cascada (Text fade-in cascade)
  const heroTitle = "De la idea a los números en días, no meses".split(" ").map((word, idx) => (
    <span key={idx} className="inline-block text-cascade-span" style={{ animationDelay: `${idx * 0.08}s` }}>
      {word}{" "}
    </span>
  ));

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <ChatbotFAB /> {/* Chatbot flotante */}
      <div className="min-h-screen bg-white">
        {/* HEADER con mejor contraste */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-100 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg hover-scale-grok">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-extrabold text-base md:text-xl text-foreground text-shimmer-fast">
                  Ecosistema Empresarial
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="text-base font-medium button-hover hover:text-primary transition-colors"
                >
                  Características
                </Button>
                <Button
                  variant="ghost"
                  className="text-base font-medium button-hover hover:text-primary transition-colors"
                >
                  Planes
                </Button>
                <Button
                  variant="ghost"
                  className="text-base font-medium button-hover hover:text-primary transition-colors"
                >
                  Contacto
                </Button>
                <Button
                  variant="outline"
                  className="text-base font-semibold button-hover magnetic-button"
                  onClick={() => navigate("/select-role")}
                >
                  Ver Demo
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white text-base font-semibold button-hover magnetic-button"
                  onClick={() => setShowLoginModal(true)}
                >
                  Iniciar Sesión
                </Button>
              </div>
              <button
                className="p-2 hover:bg-muted rounded-lg transition-colors button-hover md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="pb-4 space-y-2 border-t border-border pt-4 md:hidden">
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
                  className="w-full justify-center bg-primary hover:bg-primary/90 text-white text-base font-semibold py-3 rounded-md min-h-12 button-hover"
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

        {/* HERO - Mejor contraste y Aurora Waves */}
        <section
          ref={heroRef}
          className="hero-gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-32 md:pt-20 aurora-waves-background"
        >
          <div className="container mx-auto px-6 relative z-20">
            <div className="max-w-5xl mx-auto text-center">
              <div
                className="badge-glow scroll-fade-in mb-8 inline-flex animate-float"
                style={{ animationDelay: "0.2s" }}
              >
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">IA que entiende Argentina</span>
              </div>
              <h1 className="hero-title-grok mb-6 text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
                {heroTitle}
              </h1>
              <p
                className="text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto scroll-fade-in"
                style={{ textShadow: "0 2px 5px rgba(0,0,0,0.7)", animationDelay: "0.5s" }}
              >
                La plataforma que combina **IA + automatización** para que emprendedores y PyMEs validen ideas,
                organicen sus operaciones y escalen con una visión a largo plazo.
              </p>
              <div
                className="flex flex-wrap justify-center gap-6 mb-12 text-white text-lg scroll-fade-in"
                style={{ animationDelay: "0.7s" }}
              >
                <div className="flex items-center gap-2 glow-pulse-small">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Sin tarjeta requerida</span>
                </div>
                <div className="flex items-center gap-2 glow-pulse-small">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Datos 100% seguros</span>
                </div>
                <div className="flex items-center gap-2 glow-pulse-small">
                  <Check className="w-5 h-5 text-secondary" />
                  <span>Empezá en solo 2 minutos</span>
                </div>
              </div>
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade-in"
                style={{ animationDelay: "0.9s" }}
              >
                <Button
                  className="btn-primary-glow button-hover magnetic-button text-lg px-8 py-6"
                  onClick={() => setShowLoginModal(true)}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="outline"
                  className="btn-secondary-outline-grok button-hover magnetic-button text-lg px-8 py-6"
                  onClick={() => navigate("/select-role")}
                >
                  Ver Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE ETAPAS DEL EMPRESARIO - Diseño limpio y enfocado */}
        <section className="py-20 md:py-32 bg-gray-50 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16 scroll-fade-in">
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                Un Ecosistema para <span className="text-primary">Cada Etapa</span> de tu Negocio
              </h2>
              <p className="text-lg text-gray-600">
                Desde la validación de la idea inicial hasta la automatización de una corporación multi-sucursal,
                eliminando lo obsoleto.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <StageCard
                title="Emprendedor"
                stageLabel="FASE 1: DESDE CERO"
                icon={Zap}
                description="Tenés una idea ambiciosa, pero necesitás validación de mercado y una hoja de ruta financiera sólida antes de invertir tiempo y capital."
                features={[
                  "Validación de Idea con IA (análisis de mercado)",
                  "Proyecciones Financieras detalladas",
                  "Plan de Acción y RoadMap interactivo",
                  "Análisis de Competencia y Nicho",
                ]}
                buttonText="Validar mi idea →"
                buttonColor="hsl(var(--primary))"
                tagColor="var(--primary)"
                tagText="DESDE CERO"
              />
              <StageCard
                title="Negocio en Crecimiento"
                stageLabel="FASE 2: 1 - 3 AÑOS"
                icon={Briefcase}
                description="Ya estás vendiendo, pero la operación está desordenada. Necesitas herramientas para pasar del caos a la organización y eficiencia."
                features={[
                  "Dashboard en tiempo real con KPIs clave",
                  "CRM + Ventas y Gestión de Gastos",
                  "Control de Inventario y Proveedores",
                  "Automatización de Tareas Repetitivas",
                ]}
                buttonText="Organizar mi negocio →"
                buttonColor="hsl(var(--secondary))"
                tagColor="var(--secondary)"
                tagText="Más Elegido"
              />
              <StageCard
                title="Empresa Escalable"
                stageLabel="FASE 3: + 3 AÑOS"
                icon={TrendingUp}
                description="Tu empresa creció, ahora necesitas sistemas robustos para escalar la operación, gestionar equipos grandes y tomar decisiones basadas en IA."
                features={[
                  "Multi-sucursal / Gestión Remota",
                  "Gestión de Equipos y HR (KPIs)",
                  "Reportes predictivos impulsados por IA",
                  "Integración con Sistemas Contables Legales",
                ]}
                buttonText="Eliminar Obsoleto y Escalar →"
                buttonColor="hsl(var(--tertiary))"
                tagColor="var(--tertiary)"
                tagText="+ 3 AÑOS"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
