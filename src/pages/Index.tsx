import { useState } from "react";
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
  Sparkles,
  Brain,
  Rocket,
  ChevronRight,
  Star,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ══════════════════════════════════════════════════════════════════════
// LOGIN MODAL
// ══════════════════════════════════════════════════════════════════════
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-slate-900 to-purple-900 p-8 rounded-3xl max-w-md w-full relative shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Ingresá a tu cuenta</h2>
          <p className="text-white/80 text-base">Empezá a usar IA para tu negocio en 2 minutos</p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md hover:scale-105"
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
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all shadow-md hover:scale-105"
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
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-white/70">¿Primera vez acá?</span>
          </div>
        </div>

        <button
          className="w-full text-center text-white hover:text-white/80 transition-colors font-semibold text-lg"
          onClick={() => {
            onClose();
            window.location.href = "/auth?mode=signup";
          }}
        >
          Crear cuenta gratis →
        </button>

        <p className="text-center text-white/50 text-xs mt-6">Sin tarjeta. Sin trucos. Solo empezá.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// FLOATING BOT - Optimizado y clickeable
// ══════════════════════════════════════════════════════════════════════
function FloatingChatBot() {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <>
      <button
        onClick={() => navigate("/business-ai-bot")}
        onMouseEnter={() => setShowTooltip(false)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-40"></span>
        <MessageCircle className="w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform" />
      </button>

      {showTooltip && (
        <div className="fixed bottom-28 right-8 z-50 bg-white px-4 py-3 rounded-2xl shadow-xl border border-gray-200 animate-slide-up max-w-xs">
          <p className="text-sm font-semibold text-gray-900 mb-1">💬 ¿Necesitás ayuda?</p>
          <p className="text-xs text-gray-600">Hablá con nuestro Asesor IA</p>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════
// STAGE CARD - Optimizado
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
      hover: "hover:shadow-blue-500/50",
      text: "text-blue-600",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      hover: "hover:shadow-purple-500/50",
      text: "text-purple-600",
    },
    green: {
      bg: "from-green-500 to-green-600",
      hover: "hover:shadow-green-500/50",
      text: "text-green-600",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl ${scheme.hover} transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-100`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-black shadow-lg">
          MÁS USADO
        </div>
      )}

      <div className={`w-16 h-16 bg-gradient-to-br ${scheme.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <div className="mb-2">
        <span className={`text-xs font-bold ${scheme.text} uppercase tracking-wide`}>{stageLabel}</span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
            <div className={`w-1.5 h-1.5 rounded-full ${scheme.bg}`}></div>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-3 px-6 bg-gradient-to-r ${scheme.bg} text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 group-hover:gap-3`}
      >
        {buttonText}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════
export default function Index() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <FloatingChatBot />

      <div className="min-h-screen bg-white">
        {/* ═════════════════════════════════════════════════════════════════
            NAVBAR
            ════════════════════════════════════════════════════════════════ */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">PuebloHub Pro</span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => navigate("/select-role")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Ver Demo
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3 animate-fade-in">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/select-role");
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Ver Demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-center"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* ═════════════════════════════════════════════════════════════════
            HERO SECTION - OPTIMIZADO
            ════════════════════════════════════════════════════════════════ */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          {/* Background effects - OPTIMIZADOS con CSS puro */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          {/* Orbes animados - CSS PURO, no JS */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-slower"></div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md mb-8 shadow-lg border border-white/20 animate-fade-in">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold text-white">IA que entiende Argentina</span>
              </div>

              {/* Título */}
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in-up">
                De la <span className="text-yellow-300 drop-shadow-glow">idea</span> a los{" "}
                <span className="text-green-300 drop-shadow-glow">números</span>
                <br />
                en días, no meses
              </h1>

              {/* Descripción */}
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                La plataforma que combina <strong className="text-yellow-300">IA + automatización + datos</strong> para
                que emprendedores y PyMEs <strong className="text-green-300">validen, organicen y escalen</strong>
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-white font-semibold text-sm md:text-base">Sin tarjeta</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-white font-semibold text-sm md:text-base">Datos seguros</span>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20">
                  <Check className="w-5 h-5 text-green-300" />
                  <span className="text-white font-semibold text-sm md:text-base">Empezá en 2 min</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-7 font-bold shadow-2xl hover:scale-105 transition-transform"
                  onClick={() => navigate("/select-role")}
                >
                  <Rocket className="w-6 h-6 mr-2" />
                  Ver Demo
                </Button>
                <Button
                  size="lg"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 text-lg px-10 py-7 font-bold shadow-2xl hover:scale-105 transition-transform"
                  onClick={() => setShowLoginModal(true)}
                >
                  Iniciar Sesión
                  <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
            SECCIÓN DE ETAPAS
            ════════════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
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
                icon={Briefcase}
                description="Tu empresa creció. Automatizá y escalá con IA."
                features={["Multi-sucursal", "Gestión de equipo", "Automatización con IA"]}
                buttonText="Automatizar empresa"
                colorScheme="green"
                onClick={() => navigate("/select-role")}
              />
            </div>

            {/* CTA */}
            <div className="text-center mt-16 animate-fade-in">
              <p className="text-gray-600 mb-4">¿No estás seguro de tu etapa?</p>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform"
                onClick={() => navigate("/business-ai-bot")}
              >
                <Brain className="w-5 h-5 mr-2" />
                Dejá que la IA te ayude a elegir
              </Button>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════
            SOCIAL PROOF
            ════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
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
