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
// LOGIN MODAL COMPONENT - Estilo minimalista
// ══════════════════════════════════════════════════════════════════════
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-grok-overlay" onClick={onClose}>
      <div className="modal-grok-container" onClick={(e) => e.stopPropagation()}>
        {/* Fondo animado */}
        <div className="modal-grok-bg" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Entrá a PuebloHub Pro</h2>
            <p className="text-white/90 text-base">Empezá a usar IA para tu negocio en 2 minutos</p>
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
              <div className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/80">¿Primera vez acá?</span>
            </div>
          </div>

          {/* Link a registro */}
          <button
            className="w-full text-center text-white hover:text-white/80 transition-colors font-semibold text-lg"
            onClick={() => {
              onClose();
              window.location.href = "/auth?mode=signup";
            }}
          >
            Crear cuenta gratis
          </button>

          {/* Footer */}
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

  // Scroll fade-in observer
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
          HEADER STICKY - Minimalista
          ════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-bold text-base md:text-lg text-gray-900">PuebloHub Pro</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-semibold text-gray-700 hover:text-blue-600"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate("/select-role")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Empezar gratis
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 border-t pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => {
                  navigate("/select-role");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Empezar gratis
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════════════════
          HERO - Minimalista con PUNCH
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
        {/* Efectos de fondo sutiles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full shadow-md mb-8 scroll-fade-in">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">IA que habla argentino</span>
          </div>

          {/* Título */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-6 scroll-fade-in leading-tight">
            De la idea a la
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              facturación
            </span>{" "}
            en días
          </h1>

          {/* Subtítulo */}
          <p
            className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-12 scroll-fade-in max-w-4xl mx-auto"
            style={{ animationDelay: "0.1s" }}
          >
            La plataforma que combina <strong>IA + automatización + datos</strong> para que emprendedores y PyMEs{" "}
            <strong>validen, organicen y escalen</strong> sin perder tiempo en tareas manuales
          </p>

          {/* CTA Principal */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 scroll-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <button className="btn-primary-glow group" onClick={() => navigate("/select-role")}>
              <span>Empezar gratis</span>
              <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary-glow" onClick={() => setShowLoginModal(true)}>
              Iniciar Sesión
            </button>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 scroll-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Gratis para empezar</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Sin tarjeta</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Setup en 2 minutos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: 3 PROBLEMAS QUE RESOLVEMOS
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Todo lo que necesitás, en un solo lugar
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Dejá de saltar entre apps, planillas y papeles. PuebloHub Pro unifica todo.
            </p>
          </div>

          {/* 3 Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="relative group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all scroll-fade-in hover:shadow-xl">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Validá tu idea con IA</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Antes de invertir un peso, la IA analiza tu mercado, competencia y viabilidad. Te da números reales, no
                fantasías.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Análisis de mercado en minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Proyecciones financieras automáticas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Plan de acción personalizado</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div
              className="relative group bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all scroll-fade-in hover:shadow-xl"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Organizá todo en tiempo real</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                CRM, ventas, gastos, inventario: todo sincronizado automáticamente. Ves tu negocio en vivo, sin
                planillas manuales.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Dashboard actualizado al segundo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>CRM integrado con ventas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Control de gastos automático</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div
              className="relative group bg-gradient-to-br from-pink-50 to-white p-8 rounded-2xl border border-pink-100 hover:border-pink-300 transition-all scroll-fade-in hover:shadow-xl"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Escalá sin contratar un ejército</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                La IA automatiza tareas repetitivas. Vos te enfocás en crecer. Multi-sucursal, equipos, reportes: todo
                incluido.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span>Automatización inteligente</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span>Gestión multi-sucursal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <span>Reportes avanzados con IA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: CONOCÉ TU ASISTENTE IA
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 scroll-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-4">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Powered by AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tu asistente que nunca duerme
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              No es magia, es IA entrenada para emprendedores argentinos. Hacé más en menos tiempo.
            </p>
          </div>

          {/* 6 AI Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Leé documentos al instante",
                desc: "Subí facturas, tickets, lo que sea. La IA los procesa automáticamente.",
                color: "blue",
              },
              {
                icon: BarChart3,
                title: "Reconciliá en un click",
                desc: "La IA matchea transacciones y te ahorra horas de trabajo manual.",
                color: "purple",
              },
              {
                icon: Brain,
                title: "Sugerencias inteligentes",
                desc: "Te dice dónde ahorrar, qué optimizar y cómo crecer más rápido.",
                color: "pink",
              },
              {
                icon: DollarSign,
                title: "Detectá gastos raros",
                desc: "Si algo no cierra, la IA te avisa antes de que sea un problema.",
                color: "green",
              },
              {
                icon: Users,
                title: "Automatizá intercompany",
                desc: "Multi-entidad, eliminaciones automáticas, consolidación sin dolor.",
                color: "orange",
              },
              {
                icon: TrendingUp,
                title: "Reportes que entiende cualquiera",
                desc: "Dashboards visuales, actualizados en tiempo real, sin Excel.",
                color: "indigo",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all scroll-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
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

          {/* Stats Grid */}
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
          SECCIÓN: ELEGÍ TU ETAPA (CARDS MEJORADAS)
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Elegí tu camino</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Desde validar una idea hasta manejar una empresa con 10 sucursales: estamos para vos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Emprendedor */}
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all scroll-fade-in">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase">
                  Desde cero
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Emprendedor</h3>
              <p className="text-gray-600 mb-6 text-lg">Tenés una idea pero no sabés si va a funcionar</p>
              <ul className="space-y-3 mb-8">
                {["Validá con IA en minutos", "Proyecciones financieras reales", "Plan de acción paso a paso"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 text-base font-semibold shadow-lg"
              >
                Validar mi idea →
              </Button>
            </div>

            {/* Card 2 - Negocio (Destacada) */}
            <div
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 border-2 border-blue-600 shadow-2xl hover:shadow-3xl transition-all scroll-fade-in relative"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute -top-4 right-6 px-4 py-2 bg-yellow-400 rounded-xl text-sm font-bold text-gray-900 shadow-lg">
                ⭐ Más elegido
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <span className="px-3 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-lg uppercase">
                  1-3 años
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Negocio</h3>
              <p className="text-blue-50 mb-6 text-lg font-medium">Ya vendés pero todo está desorganizado</p>
              <ul className="space-y-3 mb-8">
                {["Dashboard en tiempo real", "CRM + Ventas + Gastos", "Control total sin planillas"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white">
                    <Check className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-white hover:bg-blue-50 text-blue-600 rounded-xl py-4 text-base font-semibold shadow-lg"
              >
                Organizar mi negocio →
              </Button>
            </div>

            {/* Card 3 - Empresa */}
            <div
              className="bg-white rounded-3xl p-8 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all scroll-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase">
                  +3 años
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Empresa</h3>
              <p className="text-gray-600 mb-6 text-lg">Creció tu empresa y necesitás escalar con IA</p>
              <ul className="space-y-3 mb-8">
                {["Multi-sucursal automatizado", "Gestión de equipos completa", "Reportes avanzados con IA"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 text-base font-semibold shadow-lg"
              >
                Automatizar empresa →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          SECCIÓN: TRUST BADGES (Como DualEntry)
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
          CTA FINAL
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">¿Listo para empezar?</h2>
          <p className="text-xl sm:text-2xl mb-10 text-white/90">
            Gratis, sin tarjeta, sin trucos. Empezás en 2 minutos.
          </p>
          <Button
            onClick={() => navigate("/select-role")}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg font-bold px-10 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
          >
            Empezar ahora →
          </Button>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════════ */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg">PuebloHub Pro</span>
            </div>
            <p className="text-sm text-gray-400">© 2025 PuebloHub Pro. Hecho con 💙 en Argentina.</p>
            <div className="flex gap-6 text-sm">
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
