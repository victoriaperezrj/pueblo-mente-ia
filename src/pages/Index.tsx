import { useState, useEffect } from "react";
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
  Clock,
  Users,
  BarChart3,
  Sparkles,
  Brain,
  Rocket,
  DollarSign,
  FileText,
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Entrá a tu cuenta</h2>
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

// ══════════════════════════════════════════════════════════════════════
// MAIN INDEX COMPONENT
// ══════════════════════════════════════════════════════════════════════
export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.3, rootMargin: "0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, observerOptions);
    document.querySelectorAll(".scroll-fade-in").forEach((el) => observer.observe(el));
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
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-sm md:text-base text-gray-900 hidden xs:block">
                Proyecto Emprendedurismo
              </span>
            </div>
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
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>
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
          HERO SECTION - CON EFECTOS EXPLOSIVOS
          ════════════════════════════════════════════════════════════════ */}
      <section className="hero-gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Efectos laterales decorativos */}
        <div className="slide-left-decoration" />
        <div className="slide-right-decoration" />
        <div className="floating-particles-left" />
        <div className="floating-particles-right" />

        {/* Contenido principal */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge superior */}
            <div className="badge-glow fade-in mb-8 inline-flex">
              <Zap className="w-4 h-4" />
              <span>IA que entiende Argentina</span>
            </div>

            {/* Título principal CON SOMBRA */}
            <h1
              className="gradient-text-animated fade-in-up mb-6"
              style={{
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              De la idea a los números en días, no meses
            </h1>

            {/* Descripción CON SOMBRA */}
            <p
              className="text-white text-xl md:text-2xl mb-4 fade-in-up font-semibold"
              style={{
                animationDelay: "0.1s",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)",
              }}
            >
              La plataforma que combina <strong>IA + automatización + datos</strong> para que emprendedores y PyMEs{" "}
              <strong>validen, organicen y escalen</strong>
            </p>

            {/* Features rápidos CON SOMBRA */}
            <div
              className="flex flex-wrap justify-center gap-8 mb-12 text-white fade-in-up"
              style={{
                animationDelay: "0.2s",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-2xl">✓</span>
                <span>Sin tarjeta</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-2xl">✓</span>
                <span>Datos seguros</span>
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-2xl">✓</span>
                <span>Empezá en 2 min</span>
              </div>
            </div>

            {/* 2 BOTONES PRINCIPALES */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <button className="btn-secondary-glow" onClick={() => navigate("/select-role")}>
                Ver Demo
              </button>
              <button className="btn-primary-glow" onClick={() => setShowLoginModal(true)}>
                Iniciar Sesión →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: 3 BENEFICIOS CLAVE (Inspirado en DualEntry)
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Todo lo que necesitás, en un solo lugar
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Dejá de saltar entre apps, planillas y papeles. Acá tenés todo unificado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Gestioná múltiples entidades",
                desc: "Manejá todas tus subsidiarias en un solo lugar, con transacciones entre empresas que se eliminan automáticamente y reportes consolidados.",
                gradient: "from-blue-50 to-white",
                border: "border-blue-100",
                iconBg: "from-blue-500 to-blue-600",
              },
              {
                icon: TrendingUp,
                title: "13.000+ integraciones nativas",
                desc: "Unificá tus datos y evitá errores con conexiones fluidas y listas para usar en todo tu stack tecnológico.",
                gradient: "from-purple-50 to-white",
                border: "border-purple-100",
                iconBg: "from-purple-500 to-purple-600",
              },
              {
                icon: Briefcase,
                title: "Personalizá tu contabilidad",
                desc: "Configurá tu sistema con clasificaciones ilimitadas y campos personalizados. Mantené tus datos granulares, informativos y listos para presentar.",
                gradient: "from-pink-50 to-white",
                border: "border-pink-100",
                iconBg: "from-pink-500 to-pink-600",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`relative group bg-gradient-to-br ${item.gradient} p-8 rounded-2xl border ${item.border} hover:shadow-2xl transition-all scroll-fade-in`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${item.iconBg} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: CONOCÉ TU ALIADO EN CONTABILIDAD (Como DualEntry)
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Powered by AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Lográ más en menos tiempo</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Eliminá el trabajo manual y enfocate en los datos que necesitás para escalar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Lectura OCR",
                desc: "Subí cualquier documento y la IA lo registra como transacción contable. Simple y fluido.",
              },
              {
                icon: BarChart3,
                title: "Auto matching bancario",
                desc: "La IA crea y matchea transacciones automáticamente para que reconcilies en pocos clicks.",
              },
              {
                icon: Brain,
                title: "Generador de reportes IA",
                desc: "Definí las reglas una vez y listo. La IA categoriza y rutea transacciones a cualquier escala.",
              },
              {
                icon: Sparkles,
                title: "Sugerencias IA",
                desc: "Conseguí nuevos insights con tu asistente inteligente para análisis rápidos, ideas de ahorro y sugerencias de workflow.",
              },
              {
                icon: Users,
                title: "Asignaciones intercompany IA",
                desc: "Consolidá más rápido con transacciones entre empresas automatizadas. La IA también reconcilia y netea balances.",
              },
              {
                icon: Target,
                title: "Detección de outliers IA",
                desc: "La IA detecta valores atípicos en transacciones antes de que las apruebes, manteniéndote en el camino correcto.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all scroll-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: NÚMEROS REALES
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Resultados que importan</h2>
            <p className="text-lg text-gray-600">No son promesas. Son datos de usuarios reales.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "90%", label: "Menos tiempo en tareas manuales", icon: Clock },
              { value: "2 min", label: "Para empezar a usar la plataforma", icon: Rocket },
              { value: "10x", label: "Más transacciones procesadas", icon: TrendingUp },
              { value: "24/7", label: "Tu asistente IA siempre activo", icon: Zap },
            ].map((stat, idx) => (
              <div key={idx} className="text-center scroll-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: ELEGÍ TU ETAPA
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Elegí tu camino</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Desde validar una idea hasta manejar una empresa: estamos para vos.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Emprendedor",
                badge: "DESDE CERO",
                desc: "Tenés una idea pero no sabés si es viable",
                features: ["Validá con IA en minutos", "Proyecciones financieras reales", "Plan de acción paso a paso"],
                btnText: "Validar mi idea →",
                bgColor: "bg-white",
                borderColor: "border-blue-200 hover:border-blue-400",
                iconBg: "from-blue-500 to-blue-600",
                badgeBg: "bg-blue-100 text-blue-700",
                btnColor: "bg-blue-600 hover:bg-blue-700",
              },
              {
                icon: BarChart3,
                title: "Negocio",
                badge: "1-3 AÑOS",
                desc: "Ya vendés pero todo está desordenado",
                features: ["Dashboard en tiempo real", "CRM + Ventas + Gastos", "Control total sin planillas"],
                btnText: "Organizar mi negocio →",
                bgColor: "bg-gradient-to-br from-blue-600 to-purple-600",
                borderColor: "border-blue-600",
                iconBg: "bg-white",
                badgeBg: "bg-blue-700 text-white",
                btnColor: "bg-white hover:bg-blue-50 text-blue-600",
                isHighlighted: true,
              },
              {
                icon: Building2,
                title: "Empresa",
                badge: "+3 AÑOS",
                desc: "Creció tu empresa y necesitás escalar",
                features: ["Multi-sucursal automatizado", "Gestión de equipos completa", "Reportes avanzados con IA"],
                btnText: "Automatizar empresa →",
                bgColor: "bg-white",
                borderColor: "border-green-200 hover:border-green-400",
                iconBg: "from-green-500 to-green-600",
                badgeBg: "bg-green-100 text-green-700",
                btnColor: "bg-green-600 hover:bg-green-700",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`${card.bgColor} rounded-3xl p-8 border-2 ${card.borderColor} hover:shadow-2xl transition-all scroll-fade-in relative`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {card.isHighlighted && (
                  <div className="absolute -top-4 right-6 px-4 py-2 bg-yellow-400 rounded-xl text-sm font-bold text-gray-900 shadow-lg">
                    ⭐ Más elegido
                  </div>
                )}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-16 h-16 ${card.isHighlighted ? card.iconBg : `bg-gradient-to-br ${card.iconBg}`} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <card.icon className={`w-8 h-8 ${card.isHighlighted ? "text-blue-600" : "text-white"}`} />
                  </div>
                  <span className={`px-3 py-1.5 ${card.badgeBg} text-xs font-bold rounded-lg uppercase`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className={`text-3xl font-bold mb-3 ${card.isHighlighted ? "text-white" : "text-gray-900"}`}>
                  {card.title}
                </h3>
                <p className={`mb-6 text-lg ${card.isHighlighted ? "text-blue-50 font-medium" : "text-gray-600"}`}>
                  {card.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {card.features.map((feat, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 ${card.isHighlighted ? "text-white" : "text-gray-700"}`}
                    >
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${card.isHighlighted ? "text-green-300" : "text-green-500"}`}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate("/select-role")}
                  className={`w-full ${card.btnColor} rounded-xl py-4 text-base font-semibold shadow-lg`}
                >
                  {card.btnText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          TRUST BADGES
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-2">Seguridad y confianza</h3>
            <p className="text-gray-400">Tus datos están protegidos con los más altos estándares</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { icon: Shield, label: "Encriptación SSL" },
              { icon: Shield, label: "Datos en Argentina" },
              { icon: Shield, label: "Backup automático" },
              { icon: Shield, label: "GDPR Compliant" },
              { icon: Shield, label: "99.9% Uptime" },
            ].map((badge, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <badge.icon className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-300 font-medium">{badge.label}</p>
              </div>
            ))}
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
          BOT WIDGET FLOTANTE
          ════════════════════════════════════════════════════════════════ */}
      <div className="bot-widget-float">
        <span className="text-3xl">🤖</span>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          MODAL LOGIN
          ════════════════════════════════════════════════════════════════ */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
