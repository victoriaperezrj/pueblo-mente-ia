import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Menu, X, Check, Zap, Briefcase, TrendingUp } from "lucide-react";
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl mb-4 shadow-2xl glow-pulse">
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

// COMPONENTE DE TARJETA DE ETAPA
interface StageCardProps {
  title: string;
  stageLabel: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
  iconColor: string;
  labelBg: string;
  onClick: () => void;
}

function StageCard({
  title,
  stageLabel,
  icon: Icon,
  description,
  features,
  buttonText,
  buttonColor,
  iconColor,
  labelBg,
  onClick,
}: StageCardProps) {
  return (
    <div className="clay-card-grok scroll-fade-in relative">
      {title === "Negocio en Crecimiento" && <div className="popular-badge">⭐ Más Popular</div>}

      <div className="flex justify-between items-start mb-4">
        <div className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${labelBg}`}>{stageLabel}</div>
        <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10`}>
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6 min-h-[80px]">{description}</p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-gray-700">
            <Check className={`w-5 h-5 flex-shrink-0 mr-2 mt-0.5 ${iconColor}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Button className={`w-full text-base font-semibold py-6 magnetic-button ${buttonColor}`} onClick={onClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

// MAIN INDEX
export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll(".scroll-fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Crear partículas flotantes
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const particlesContainer = document.createElement("div");
    particlesContainer.className = "floating-particles";
    hero.appendChild(particlesContainer);

    // Crear 30 partículas
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.animationDuration = `${10 + Math.random() * 10}s`;
      particlesContainer.appendChild(particle);
    }

    return () => {
      particlesContainer.remove();
    };
  }, []);

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="min-h-screen bg-white">
        {/* HEADER */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg glow-pulse">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="font-extrabold text-base md:text-xl text-gray-900">PuebloHub Pro</span>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Button
                  variant="outline"
                  className="text-base font-semibold magnetic-button"
                  onClick={() => navigate("/select-role")}
                >
                  Ver Demo
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold magnetic-button"
                  onClick={() => setShowLoginModal(true)}
                >
                  Iniciar Sesión
                </Button>
              </div>

              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="pb-4 space-y-2 border-t border-gray-200 pt-4 md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLoginModal(true);
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
                  className="w-full justify-center bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold"
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

        {/* HERO - Fondo con Aurora Waves mejorado */}
        <section
          ref={heroRef}
          className="aurora-waves-background min-h-screen flex items-center justify-center relative overflow-hidden pt-24 md:pt-20"
        >
          <div className="container mx-auto px-6 relative z-10 content-wrapper">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 scroll-fade-in">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">IA que entiende Argentina</span>
              </div>

              {/* Título principal con mejor legibilidad */}
              <h1 className="hero-title-grok mb-6 px-4">
                De la idea a los <span className="highlight">números</span> en días, no meses
              </h1>

              {/* Descripción */}
              <p
                className="text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed scroll-fade-in"
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)",
                  animationDelay: "0.3s",
                }}
              >
                La plataforma que combina <strong className="text-yellow-300">IA + automatización + datos</strong> para
                que emprendedores y PyMEs <strong className="text-green-300">validen, organicen y escalen</strong>
              </p>

              {/* Features */}
              <div
                className="flex flex-wrap justify-center gap-6 mb-12 scroll-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Sin tarjeta</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Datos seguros</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Empezá en 2 min</span>
                </div>
              </div>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade-in"
                style={{ animationDelay: "0.7s" }}
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 magnetic-button font-bold shadow-2xl"
                  onClick={() => navigate("/select-role")}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Ver Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 magnetic-button font-bold backdrop-blur-sm"
                  onClick={() => setShowLoginModal(true)}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN DE ETAPAS */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden noise-texture">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16 scroll-fade-in">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">¿En qué etapa estás?</h2>
              <p className="text-lg text-gray-600">
                Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <StageCard
                title="Emprendedor"
                stageLabel="DESDE CERO"
                icon={Zap}
                description="¿Tenés una idea pero no sabés si funciona?"
                features={["Validá con IA en minutos", "Ves números reales", "Entendé viabilidad"]}
                buttonText="Validar idea →"
                buttonColor="bg-blue-500 hover:bg-blue-600 text-white"
                iconColor="text-blue-500"
                labelBg="bg-blue-500"
                onClick={() => navigate("/select-role")}
              />

              <StageCard
                title="Negocio"
                stageLabel="1-3 AÑOS"
                icon={Briefcase}
                description="Vendés, pero todo a mano. Necesitás ordenar y crecer."
                features={["Dashboard real-time", "CRM + Ventas + Gastos", "Control sin planillas"]}
                buttonText="Organizar negocio →"
                buttonColor="bg-green-500 hover:bg-green-600 text-white"
                iconColor="text-green-500"
                labelBg="bg-green-500"
                onClick={() => navigate("/select-role")}
              />

              <StageCard
                title="Empresa"
                stageLabel="+3 AÑOS"
                icon={TrendingUp}
                description="Tu empresa creció. Automatizá y escalá con IA."
                features={["Multi-sucursal", "Gestión de equipo", "Automatización", "Reportes con IA"]}
                buttonText="Automatizar empresa →"
                buttonColor="bg-purple-500 hover:bg-purple-600 text-white"
                iconColor="text-purple-500"
                labelBg="bg-purple-500"
                onClick={() => navigate("/select-role")}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
