import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Lightbulb,
  Calculator,
  ClipboardCheck,
  FileText,
  BookOpen,
  Settings,
  Menu,
  AlertCircle,
  X,
  TrendingUp,
  DollarSign,
  CheckSquare,
  FileCheck,
  Rocket,
  Target,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { safeJSONParse } from "@/lib/safe-json";
import { logger } from "@/lib/logger";
import LocalIA from "@/components/LocalIA";

const EntrepreneurDashboard = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [progressData, setProgressData] = useState({
    validation: 0,
    leanCanvas: 0,
    legalChecklist: 0,
  });

  useEffect(() => {
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('banner_closed');
    if (bannerClosed === 'true') {
      setShowBanner(false);
    }

    // Load progress data from localStorage
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    const leanCanvas = localStorage.getItem('lean_canvas_data');
    const financial = localStorage.getItem('financial_simulation');
    const checklist = localStorage.getItem('checklist_progress');

    let leanCanvasProgress = 0;
    const leanData = safeJSONParse(leanCanvas, {});
    if (Object.keys(leanData).length > 0) {
      const totalBlocks = 9;
      const completedBlocks = Object.values(leanData).filter(v => v && String(v).trim() !== '').length;
      leanCanvasProgress = Math.round((completedBlocks / totalBlocks) * 100);
    }

    let checklistProgress = 0;
    const checkData = safeJSONParse(checklist, { completed: 0 });
    const total = 5;
    checklistProgress = Math.round((checkData.completed / total) * 100);

    setProgressData({
      validation: leanCanvasProgress,
      leanCanvas: leanCanvasProgress,
      legalChecklist: checklistProgress,
    });
  };

  const closeBanner = () => {
    setShowBanner(false);
    localStorage.setItem('banner_closed', 'true');
  };

  const openRegisterModal = () => {
    navigate('/auth');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/demo/emprendedor/dashboard", active: true },
    { icon: Lightbulb, label: "Validación de Idea", path: "/demo/emprendedor/validacion-idea" },
    { icon: FileText, label: "Lean Canvas", path: "/demo/emprendedor/lean-canvas" },
    { icon: Calculator, label: "Simulador Financiero", path: "/demo/emprendedor/simulador" },
    { icon: ClipboardCheck, label: "Checklist de Trámites", path: "/demo/emprendedor/checklist" },
    { icon: BookOpen, label: "Recursos y Guías", path: "/demo/emprendedor/recursos" },
    { icon: Settings, label: "Configuración", path: "/demo/emprendedor/configuracion" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary/5 to-white">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 gradient-emprendedor rounded-xl flex items-center justify-center shadow-lg animate-float">
            <Rocket className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900">Emprendedor</span>
            <p className="text-xs text-slate-600">Valida tu idea</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left font-medium group",
              item.active
                ? "gradient-emprendedor text-foreground shadow-lg shadow-primary/30"
                : "text-slate-700 hover:bg-primary/10 hover:text-primary"
            )}
            aria-label={item.label}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform",
              item.active ? "scale-110" : "group-hover:scale-110"
            )} />
            <span className="text-sm">{item.label}</span>
            {item.active && (
              <div className="ml-auto w-2 h-2 bg-foreground rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 bg-gradient-to-t from-slate-50 to-transparent">
        <Button
          variant="outline"
          className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-foreground font-semibold py-6 rounded-xl transition-all"
          onClick={openRegisterModal}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Crear Cuenta Premium
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F5F8FF] to-white">
      <LocalIA />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b z-50 p-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menú">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-slate-200 fixed h-screen">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Welcome */}
            <div className="mb-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-glow-pulse">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Etapa: Emprendedor</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
                ¡Bienvenido de vuelta!
              </h1>
              <p className="text-lg text-slate-600">
                Valida tu idea y transforma tu visión en un plan de negocio sólido
              </p>
            </div>

            {/* Demo Banner */}
            {showBanner && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-800 text-sm">
                    <strong>MODO DEMO</strong> - Los cambios no se guardan permanentemente. Crea una cuenta para guardar tu progreso.
                  </p>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-yellow-900 underline p-0 h-auto mt-1"
                    onClick={openRegisterModal}
                  >
                    Crear cuenta
                  </Button>
                </div>
                <button
                  onClick={closeBanner}
                  className="text-yellow-600 hover:text-yellow-800"
                  aria-label="Cerrar banner"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 gradient-card card-3d">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 gradient-emprendedor rounded-xl shadow-lg">
                        <TrendingUp className="h-5 w-5 text-foreground" />
                      </div>
                      <CardTitle className="text-base font-semibold">Validación</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      {progressData.validation}%
                    </div>
                    <Progress value={progressData.validation} className="h-2.5 bg-slate-200" />
                    <p className="text-xs text-slate-600">
                      {progressData.validation === 0 ? "¡Empieza tu validación!" : "¡Excelente progreso!"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-success/10 hover:border-success/30 hover:shadow-2xl transition-all duration-300 gradient-card card-3d">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 gradient-pyme rounded-xl shadow-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-base font-semibold">Rentabilidad</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900">Sin datos</div>
                    <p className="text-xs text-slate-600">
                      Usa el simulador financiero
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/10 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 gradient-card card-3d">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 gradient-emprendedor rounded-xl shadow-lg">
                        <CheckSquare className="h-5 w-5 text-foreground" />
                      </div>
                      <CardTitle className="text-base font-semibold">Lean Canvas</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round((progressData.leanCanvas / 100) * 9)}/9 bloques
                    </div>
                    <Progress value={progressData.leanCanvas} className="h-2.5 bg-slate-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/10 hover:border-secondary/30 hover:shadow-2xl transition-all duration-300 gradient-card card-3d">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 gradient-negocio rounded-xl shadow-lg">
                        <FileCheck className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-base font-semibold">Trámites</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-secondary">
                      {Math.round((progressData.legalChecklist / 100) * 5)}/5 hechos
                    </div>
                    <Progress value={progressData.legalChecklist} className="h-2.5 bg-slate-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* First Steps Checklist */}
            <Card className="border-2 border-slate-200 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 mb-8 gradient-card card-3d">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <div className="p-2 gradient-emprendedor rounded-lg">
                    <Target className="h-6 w-6 text-foreground" />
                  </div>
                  Tus Primeros Pasos
                </CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  Completa estos pasos para validar tu idea de negocio
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { id: 1, text: "✨ Valida tu idea completando el Lean Canvas", icon: Lightbulb },
                    { id: 2, text: "💰 Simula tu rentabilidad con números reales", icon: Calculator },
                    { id: 3, text: "📋 Completa el checklist de trámites AFIP", icon: ClipboardCheck },
                    { id: 4, text: "🎯 Define misión y visión de tu emprendimiento", icon: Target },
                    { id: 5, text: "📚 Revisa recursos y guías disponibles", icon: BookOpen },
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-primary/5 transition-all group cursor-pointer border border-transparent hover:border-primary/20 hover-lift">
                        <div className="w-10 h-10 rounded-xl border-2 border-slate-300 group-hover:border-primary flex items-center justify-center flex-shrink-0 transition-all">
                          <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-slate-700 group-hover:text-primary font-medium transition-colors">{step.text}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="gradient-emprendedor text-foreground px-12 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all animate-glow-pulse group"
                onClick={() => navigate('/demo/emprendedor/validacion-idea')}
              >
                <Rocket className="w-6 h-6 mr-2 group-hover:translate-x-1 transition-transform" />
                Empezar Validación de Idea
              </Button>
              <p className="text-sm text-slate-600">
                ¿Necesitas ayuda? Usa el asistente <span className="font-semibold text-primary">LocalIA</span> en la esquina inferior
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
