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
  Users,
  BarChart3,
  Sparkles,
  Brain,
  Rocket,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ══════════════════════════════════════════════════════════════════════
// LOGIN MODAL - DISEÑO PROFESIONAL TONED DOWN
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
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl mb-4 shadow-xl">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Iniciá sesión</h2>
            <p className="text-white/80 text-sm">Comenzá a usar IA para tu negocio en minutos</p>
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
              <div className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">¿Nuevo usuario?</span>
            </div>
          </div>
          <button
            className="w-full text-center text-white hover:text-white/80 transition-colors font-medium text-base"
            onClick={() => {
              onClose();
              window.location.href = "/auth?mode=signup";
            }}
          >
            Crear cuenta gratuita
          </button>
          <p className="text-center text-white/50 text-xs mt-6">Sin tarjeta requerida.</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN INDEX - DISEÑO PROFESIONAL TONED DOWN
// ══════════════════════════════════════════════════════════════════════
export default function Index() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.2, rootMargin: "0px" };
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
      {/* ═══════════════════════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100">
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

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION - COLORES PROFESIONALES
          ══════════════════════════════════════════════════════════ */}
      <section className="hero-gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="slide-left-decoration" />
        <div className="slide-right-decoration" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="badge-glow fade-in mb-6 inline-flex">
              <Zap className="w-4 h-4" />
              <span>IA adaptada a Argentina</span>
            </div>

            <h1 className="gradient-text-animated fade-in-up mb-6">De la idea a los números en días</h1>

            <p className="text-white text-lg md:text-xl mb-4 fade-in-up font-medium" style={{ animationDelay: "0.1s" }}>
              Plataforma que une <strong>IA + automatización + datos</strong> para que emprendedores y PyMEs{" "}
              <strong>validen, organicen y escalen</strong>
            </p>

            <div
              className="flex flex-wrap justify-center gap-6 mb-10 text-white fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center gap-2 font-medium text-base">
                <span className="text-xl">✓</span>
                <span>Sin tarjeta</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-base">
                <span className="text-xl">✓</span>
                <span>Datos seguros</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-base">
                <span className="text-xl">✓</span>
                <span>Empezá en minutos</span>
              </div>
            </div>

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

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN: BENEFICIOS - TONED DOWN
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-100/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-100/20 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Todo en un solo lugar</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Unifica apps, planillas y procesos en una plataforma simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Validá con IA",
                desc: "Analiza mercado, competencia y viabilidad antes de invertir.",
                features: ["Análisis de mercado", "Proyecciones financieras", "Plan de acción"],
              },
              {
                icon: TrendingUp,
                title: "Organizá en real time",
                desc: "CRM, ventas, gastos sincronizados automáticamente.",
                features: ["Dashboard vivo", "CRM integrado", "Control de gastos"],
              },
              {
                icon: Briefcase,
                title: "Escalá eficientemente",
                desc: "Automatiza tareas, maneja multi-sucursal y reportes.",
                features: ["Automatización IA", "Multi-sucursal", "Reportes avanzados"],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all scroll-fade-in card-hover"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN: CAPACIDADES IA - TONED DOWN
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">IA Integrada</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Asistente inteligente 24/7
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              IA entrenada para el ecosistema emprendedor argentino.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Procesá documentos",
                desc: "Subí facturas y tickets; la IA los lee automáticamente.",
              },
              {
                icon: BarChart3,
                title: "Reconciliá rápido",
                desc: "Matchea transacciones sin esfuerzo manual.",
              },
              {
                icon: Brain,
                title: "Sugerencias proactivas",
                desc: "Ideas para ahorrar y optimizar crecimiento.",
              },
              {
                icon: Shield,
                title: "Detectá anomalías",
                desc: "Alertas tempranas sobre gastos irregulares.",
              },
              {
                icon: Users,
                title: "Manejo multi-entidad",
                desc: "Eliminaciones y consolidación automáticas.",
              },
              {
                icon: TrendingUp,
                title: "Dashboards visuales",
                desc: "Reportes en tiempo real sin complicaciones.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all scroll-fade-in card-hover"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-all">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN: ELEGÍ TU ETAPA - COLORES PROFESIONALES
          ══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Elegí tu etapa</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Adaptado desde ideas iniciales hasta empresas establecidas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Emprendedor */}
            <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all scroll-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">Desde cero</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Emprendedor</h3>
              <p className="text-gray-600 mb-4">Idea en mente, validala rápido.</p>
              <ul className="space-y-2 mb-6">
                {["Validación IA", "Proyecciones", "Plan inicial"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-sm font-medium shadow-sm group-hover:shadow-md transition-all"
              >
                Validar idea →
              </Button>
            </div>

            {/* Card 2 - Negocio */}
            <div
              className="group relative bg-gradient-to-br from-blue-50/30 to-green-50/30 rounded-2xl p-6 border border-blue-200 shadow-md hover:shadow-lg transition-all scroll-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-blue-100 to-green-100 rounded-md text-xs font-medium text-gray-800 shadow-sm">
                ⭐ Recomendado
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">1-3 años</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Negocio</h3>
              <p className="text-gray-600 mb-4">Ventas en marcha, organizalo.</p>
              <ul className="space-y-2 mb-6">
                {["Dashboard real-time", "CRM + Ventas", "Control simple"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg py-3 text-sm font-medium shadow-sm group-hover:shadow-md transition-all"
              >
                Organizar negocio →
              </Button>
            </div>

            {/* Card 3 - Empresa */}
            <div
              className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all scroll-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-md">+3 años</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresa</h3>
              <p className="text-gray-600 mb-4">Crecimiento sostenido, escalalo.</p>
              <ul className="space-y-2 mb-6">
                {["Multi-sucursal", "Gestión equipos", "Reportes IA"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-medium shadow-sm group-hover:shadow-md transition-all"
              >
                Automatizar empresa →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST BADGES - TONED DOWN
          ══════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-2">Seguridad primero</h3>
            <p className="text-gray-300 text-sm">Protección de datos con estándares globales.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Shield, label: "Encriptación SSL" },
              { icon: Shield, label: "Datos locales" },
              { icon: Shield, label: "Backups diarios" },
              { icon: Shield, label: "Cumple GDPR" },
              { icon: Shield, label: "Soporte constante" },
            ].map((badge, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-gray-600 transition-colors">
                  <badge.icon className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-xs text-gray-300">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER - SIMPLE
          ══════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium">Proyecto Emprendedurismo</span>
            </div>
            <p className="text-gray-400">© 2025. Hecho en Argentina.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* BOT WIDGET */}
      <div className="bot-widget-float">
        <span className="text-2xl">🤖</span>
      </div>

      {/* MODAL LOGIN */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
