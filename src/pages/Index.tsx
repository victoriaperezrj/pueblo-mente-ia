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
  Brain,
  FileText,
  ArrowRight,
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

// MAIN INDEX
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

  const heroTitle = "De la idea a los números en días, no meses".split(" ").map((word, idx) => (
    <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
      {word}{" "}
    </span>
  ));

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER - SIMPLIFICADO SIN BOTONES EXTRA */}
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
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
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

      {/* HERO SECTION */}
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
              <button className="btn-primary-glow button-hover" onClick={() => setShowLoginModal(true)}>
                Iniciar Sesión →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS SECTION */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white wave-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-cascade">
              {"Todo en un solo lugar".split(" ").map((word, idx) => (
                <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-in-up">
              Olvidate de saltar entre apps y planillas. Acá tenés todo integrado y simple para enfocarte en crecer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Validá tu idea con IA",
                desc: "Antes de invertir tiempo o dinero, usa IA para analizar mercado, competencia y viabilidad real.",
                features: [
                  "Análisis de mercado inteligente",
                  "Proyecciones financieras precisas",
                  "Plan de acción personalizado",
                ],
              },
              {
                icon: TrendingUp,
                title: "Organizá en tiempo real",
                desc: "CRM, ventas, gastos e inventario sincronizados automáticamente para ver tu negocio en vivo.",
                features: ["Dashboard dinámico y actualizado", "CRM integrado y fácil", "Control de gastos automático"],
              },
              {
                icon: Briefcase,
                title: "Escalá con eficiencia",
                desc: "Automatiza lo repetitivo, maneja múltiples sucursales y genera reportes avanzados con IA.",
                features: [
                  "Automatizaciones inteligentes",
                  "Gestión multi-sucursal",
                  "Reportes detallados con insights",
                ],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-card p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-all scroll-fade-in card-hover wave-background"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform animate-float">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2"> {item.title}</h3>
                <p className="text-muted-foreground mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPACIDADES IA */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white wave-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full mb-4 animate-float">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">IA Integrada</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-cascade">
              {"Asistente inteligente 24/7".split(" ").map((word, idx) => (
                <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto fade-in-up">
              IA especializada en el mundo emprendedor argentino, trabajando para vos todo el día.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Procesá documentos al instante",
                desc: "Subí facturas o tickets; la IA los analiza y categoriza automáticamente.",
              },
              {
                icon: BarChart3,
                title: "Reconciliá en segundos",
                desc: "Matchea transacciones bancarias sin esfuerzo manual ni errores.",
              },
              {
                icon: Brain,
                title: "Sugerencias inteligentes",
                desc: "Recibe recomendaciones para optimizar costos y acelerar crecimiento.",
              },
              {
                icon: Shield,
                title: "Detectá anomalías temprano",
                desc: "Alertas inmediatas sobre gastos inusuales o irregularidades.",
              },
              {
                icon: Users,
                title: "Manejo multi-entidad",
                desc: "Gestiona múltiples empresas con consolidaciones automáticas.",
              },
              {
                icon: TrendingUp,
                title: "Dashboards visuales",
                desc: "Reportes interactivos en tiempo real, sin complicadas planillas.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group bg-card p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all scroll-fade-in card-hover wave-background"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all animate-float">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELEGÍ TU ETAPA - DISEÑO NUEVO MÁS BONITO CON EFECTOS CHETO */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-br from-gray-50 to-white wave-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 text-cascade">
              {"¿En qué etapa estás?".split(" ").map((word, idx) => (
                <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
                  {word}{" "}
                </span>
              ))}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto fade-in-up">
              Seleccioná tu momento actual y desbloqueá herramientas personalizadas para impulsarte al siguiente nivel.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card 1 - Emprendedor - Gradiente azul-celeste bonito */}
            <div className="group relative bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 border border-blue-200 shadow-md hover:shadow-xl transition-all scroll-fade-in card-hover wave-background">
              <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity animate-float">
                <Rocket className="w-12 h-12 text-blue-500 rotate-45" />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-float">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-lg uppercase">
                  Idea inicial
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Emprendedor</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Convertí tu idea en un plan viable con análisis inteligentes.
              </p>
              <ul className="space-y-3 mb-8">
                {["Validación rápida con IA", "Proyecciones financieras claras", "Guía paso a paso para lanzar"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-4 text-base font-semibold shadow-md group-hover:shadow-lg transition-all button-hover"
              >
                Validar mi idea →
              </Button>
            </div>

            {/* Card 2 - Negocio - Gradiente púrpura-rosa bonito */}
            <div
              className="group relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border border-purple-200 shadow-md hover:shadow-xl transition-all scroll-fade-in card-hover wave-background"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute -top-4 right-6 px-4 py-2 bg-gradient-to-r from-pink-300 to-orange-300 rounded-xl text-sm font-bold text-white shadow-lg animate-float">
                ⭐ Recomendado
              </div>
              <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity animate-float">
                <TrendingUp className="w-12 h-12 text-purple-500" />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-float">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-600 text-xs font-bold rounded-lg uppercase">
                  En crecimiento
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Negocio</h3>
              <p className="text-muted-foreground mb-6 text-lg font-medium">
                Organizá tu operación diaria para maximizar eficiencia y ventas.
              </p>
              <ul className="space-y-3 mb-8">
                {["Dashboard intuitivo en tiempo real", "CRM + ventas integradas", "Control de gastos inteligente"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-purple-600 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-4 text-base font-semibold shadow-md group-hover:shadow-lg transition-all button-hover"
              >
                Organizar mi negocio →
              </Button>
            </div>

            {/* Card 3 - Empresa - Gradiente verde-lima bonito */}
            <div
              className="group relative bg-gradient-to-br from-green-100 to-lime-100 rounded-3xl p-8 border border-green-200 shadow-md hover:shadow-xl transition-all scroll-fade-in card-hover wave-background"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity animate-float">
                <Users className="w-12 h-12 text-green-500" />
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-float">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <span className="px-3 py-1.5 bg-green-100 text-green-600 text-xs font-bold rounded-lg uppercase">
                  Escala avanzada
                </span>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">Empresa</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Expande con herramientas para equipos y operaciones complejas.
              </p>
              <ul className="space-y-3 mb-8">
                {["Gestión multi-sucursal fluida", "Colaboración de equipos", "Insights avanzados con IA"].map(
                  (item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ),
                )}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-4 text-base font-semibold shadow-md group-hover:shadow-lg transition-all button-hover"
              >
                Automatizar mi empresa →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-16 px-4 bg-gray-900 text-white wave-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-2">Seguridad y confianza</h3>
            <p className="text-gray-400">Tus datos protegidos con los más altos estándares</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { icon: Shield, label: "Encriptación SSL" },
              { icon: Shield, label: "Datos en Argentina" },
              { icon: Shield, label: "Backup automático" },
              { icon: Shield, label: "GDPR Compliant" },
              { icon: Shield, label: "Soporte 24/7" },
            ].map((badge, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-700 transition-colors animate-float">
                  <badge.icon className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-300 font-medium">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg">Proyecto Emprendedurismo</span>
            </div>
            <p className="text-sm text-gray-400">© 2025 Proyecto Emprendedurismo. Hecho con 💙 en Argentina.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition button-hover">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition button-hover">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition button-hover">
                Soporte
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* BOT WIDGET */}
      <div className="bot-widget-float animate-float">
        <span className="text-3xl">🤖</span>
      </div>

      {/* MODAL LOGIN */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
