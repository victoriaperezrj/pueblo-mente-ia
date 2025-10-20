import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Menu,
  X,
  Check,
  Zap,
  Target,
  TrendingUp,
  Briefcase,
  Shield,
  Users,
  BarChart3,
  Sparkles,
  Brain,
  Rocket,
  FileText,
  ArrowRight,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ══════════════════════════════════════════════════════════════════════
// LOGIN MODAL COMPONENT
// ══════════════════════════════════════════════════════════════════════
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl glow-pulse">
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
            <button
              className="btn-login-grok magnetic-button"
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
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/80">¿Primera vez acá?</span>
            </div>
          </div>
          <button
            className="w-full text-center text-white hover:text-white/80 transition-colors font-semibold text-lg magnetic-button"
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

// ══════════════════════════════════════════════════════════════════════
// STAGE CARD COMPONENT - Con diseño mejorado
// ══════════════════════════════════════════════════════════════════════
interface StageCardProps {
  title: string;
  stageLabel: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  buttonText: string;
  colorScheme: "blue" | "purple" | "green";
  isPopular?: boolean;
  onClick: () => void;
}

function StageCard({
  title,
  stageLabel,
  icon: Icon,
  description,
  features,
  buttonText,
  colorScheme,
  isPopular = false,
  onClick,
}: StageCardProps) {
  const colors = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      button: "bg-blue-500 hover:bg-blue-600",
      icon: "text-blue-500",
      badge: "bg-blue-500",
      glow: "group-hover:shadow-blue-500/50",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      button: "bg-purple-500 hover:bg-purple-600",
      icon: "text-purple-500",
      badge: "bg-purple-500",
      glow: "group-hover:shadow-purple-500/50",
    },
    green: {
      bg: "from-green-500 to-green-600",
      button: "bg-green-500 hover:bg-green-600",
      icon: "text-green-500",
      badge: "bg-green-500",
      glow: "group-hover:shadow-green-500/50",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <div className="clay-card-grok scroll-fade-in group relative cursor-pointer" onClick={onClick}>
      {isPopular && (
        <div className="popular-badge flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          Más elegido
        </div>
      )}

      <div
        className={`absolute -inset-1 bg-gradient-to-r ${scheme.bg} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 ${scheme.glow}`}
      ></div>

      <div className="relative p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div className={`text-xs font-bold px-3 py-1.5 rounded-full text-white ${scheme.badge}`}>{stageLabel}</div>
          <div className={`p-3 rounded-xl bg-gray-100 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-7 h-7 ${scheme.icon}`} />
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <Check className={`w-5 h-5 flex-shrink-0 mr-2 mt-0.5 ${scheme.icon}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full text-base font-semibold py-6 ${scheme.button} text-white magnetic-button shadow-lg group-hover:shadow-xl transition-all`}
        >
          {buttonText}
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
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
  const heroRef = useRef<HTMLDivElement>(null);

  // Animación de partículas en el hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const particlesContainer = document.createElement("div");
    particlesContainer.className = "floating-particles";
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 40; i++) {
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

  // Scroll reveal observer
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

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="min-h-screen bg-white">
        {/* ═══════════════════════════════════════════════════════════════
            HEADER STICKY
            ══════════════════════════════════════════════════════════════ */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg glow-pulse">
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

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION - Con Aurora Waves y partículas
            ══════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="aurora-waves-background min-h-screen flex items-center justify-center relative overflow-hidden pt-24 md:pt-20"
        >
          <div className="container mx-auto px-6 relative z-10 content-wrapper">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge superior con glassmorphism */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 scroll-fade-in">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold text-white">IA que entiende Argentina</span>
              </div>

              {/* Título principal - LEGIBLE y CON EFECTO */}
              <h1 className="hero-title-grok mb-6 px-4">
                De la <span className="highlight">idea</span> a los <span className="highlight">números</span> en días,{" "}
                <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">no meses</span>
              </h1>

              {/* Descripción con shadow fuerte */}
              <p
                className="text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed scroll-fade-in font-medium"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
                  animationDelay: "0.3s",
                }}
              >
                La plataforma que combina{" "}
                <strong className="text-yellow-300 font-bold">IA + automatización + datos</strong> para que
                emprendedores y PyMEs <strong className="text-green-300 font-bold">validen, organicen y escalen</strong>
              </p>

              {/* Features badges */}
              <div
                className="flex flex-wrap justify-center gap-4 mb-12 scroll-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold text-sm md:text-base">Sin tarjeta</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold text-sm md:text-base">Datos seguros</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-lg">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold text-sm md:text-base">Empezá en 2 min</span>
                </div>
              </div>

              {/* CTAs con efecto mejorado */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade-in"
                style={{ animationDelay: "0.7s" }}
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-7 magnetic-button font-bold shadow-2xl hover:shadow-white/50 transition-all"
                  onClick={() => navigate("/select-role")}
                >
                  <Rocket className="w-6 h-6 mr-2" />
                  Ver Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm text-lg px-10 py-7 magnetic-button font-bold shadow-2xl transition-all"
                  onClick={() => setShowLoginModal(true)}
                >
                  Iniciar Sesión
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN DE ETAPAS - Cards mejoradas
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden noise-texture">
          {/* Decoración de fondo */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16 scroll-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4">
                <Target className="w-4 h-4" />
                Tu camino al éxito
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                ¿En qué{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  etapa
                </span>{" "}
                estás?
              </h2>
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
                buttonText="Validar idea"
                colorScheme="blue"
                onClick={() => navigate("/select-role")}
              />

              <StageCard
                title="Negocio"
                stageLabel="1-3 AÑOS"
                icon={TrendingUp}
                description="Vendés, pero todo a mano. Necesitás ordenar y crecer."
                features={["Dashboard real-time", "CRM + Ventas + Gastos", "Control sin planillas"]}
                buttonText="Organizar negocio"
                colorScheme="purple"
                isPopular={true}
                onClick={() => navigate("/select-role")}
              />

              <StageCard
                title="Empresa"
                stageLabel="+3 AÑOS"
                icon={Building2}
                description="Tu empresa creció. Automatizá y escalá con IA."
                features={["Multi-sucursal", "Gestión de equipo", "Automatización con IA"]}
                buttonText="Automatizar empresa"
                colorScheme="green"
                onClick={() => navigate("/select-role")}
              />
            </div>

            {/* CTA adicional */}
            <div className="text-center mt-16 scroll-fade-in">
              <p className="text-gray-600 mb-4">¿No estás seguro de tu etapa?</p>
              <Button variant="outline" size="lg" className="magnetic-button" onClick={() => navigate("/select-role")}>
                <Brain className="w-5 h-5 mr-2" />
                Dejá que la IA te ayude a elegir
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECCIÓN DE CONFIANZA - Social proof
            ══════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center scroll-fade-in">
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-8 font-semibold">
                Confiado por emprendedores argentinos
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">+1,000 usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
