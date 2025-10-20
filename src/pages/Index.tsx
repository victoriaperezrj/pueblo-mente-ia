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
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      { threshold: 0.3 },
    );
    document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const heroTitle = "De la idea a los números en días, no meses".split(" ").map((word, idx) => (
    <span key={idx} style={{ animationDelay: `${idx * 0.05}s` }}>
      {word}{" "}
    </span>
  ));

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-base hidden sm:block">Proyecto Emprendedurismo</span>
            </div>
            <button
              className="p-2 hover:bg-muted rounded-lg transition button-hover"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="pb-4 space-y-2 border-t border-border pt-4">
              <Button onClick={() => setShowLoginModal(true)} className="w-full button-hover">
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate("/auth?mode=signup")}
                className="w-full bg-primary text-white button-hover"
              >
                Crear Cuenta
              </Button>
              <Button variant="outline" onClick={() => navigate("/select-role")} className="w-full button-hover">
                Ver Demo
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="aurora-bg min-h-screen flex items-center justify-center pt-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="badge-glow mb-6 inline-flex animate-float">
            <Zap className="w-4 h-4" />
            <span>IA que entiende Argentina</span>
          </div>
          <h1 className="text-shimmer text-cascade text-4xl sm:text-5xl md:text-6xl font-bold mb-6">{heroTitle}</h1>
          <p className="text-white text-lg md:text-xl mb-8 max-w-3xl mx-auto scroll-reveal">
            La plataforma que combina IA + automatización + datos para que emprendedores y PyMEs validen ideas,
            organicen operaciones y escalen con confianza.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-white text-lg scroll-reveal">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-reveal">
            <button className="btn-secondary-glow button-hover" onClick={() => navigate("/select-role")}>
              Ver Demo
            </button>
            <button className="btn-primary-glow button-hover" onClick={() => setShowLoginModal(true)}>
              Iniciar Sesión →
            </button>
          </div>
        </div>
      </section>

      {/* ETAPAS */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto text-center mb-16 scroll-reveal">
          <h2 className="text-4xl font-bold text-cascade mb-4">¿En qué etapa estás?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Seleccioná tu momento actual y desbloqueá herramientas personalizadas para impulsarte al siguiente nivel.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Emprendedor",
              subtitle: "Idea inicial",
              icon: <Rocket className="w-12 h-12 text-blue-500 rotate-45" />,
              color: "blue",
              features: ["Validación rápida con IA", "Proyecciones financieras claras", "Guía paso a paso para lanzar"],
              button: "Validar mi idea →",
            },
            {
              title: "Negocio",
              subtitle: "En crecimiento",
              icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
              color: "purple",
              features: ["Dashboard intuitivo", "CRM + ventas integradas", "Control de gastos inteligente"],
              button: "Organizar mi negocio →",
            },
            {
              title: "Empresa",
              subtitle: "Escalando",
              icon: <Users className="w-12 h-12 text-green-500" />,
              color: "green",
              features: ["Automatización avanzada", "Gestión multi-sucursal", "Reportes con IA"],
              button: "Automatizar empresa →",
            },
          ].map((stage, idx) => (
            <div
              key={idx}
              className={`clay-card p-8 scroll-reveal hover-scale wave-background`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-16 h-16 bg-${stage.color}-500 rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span
                  className={`px-3 py-1.5 bg-${stage.color}-100 text-${stage.color}-600 text-xs font-bold rounded-lg uppercase`}
                >
                  {stage.subtitle}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{stage.title}</h3>
              <ul className="space-y-3 mb-6">
                {stage.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <Check className={`w-5 h-5 text-${stage.color}-600`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => navigate("/select-role")}
                className={`w-full bg-${stage.color}-500 hover:bg-${stage.color}-600 text-white rounded-xl py-4 font-semibold button-hover`}
              >
                {stage.button}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
