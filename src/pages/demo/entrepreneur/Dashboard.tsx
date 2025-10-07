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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    try {
      const leanCanvas = localStorage.getItem('lean_canvas_data');
      const financial = localStorage.getItem('financial_simulation');
      const checklist = localStorage.getItem('checklist_progress');

      let leanCanvasProgress = 0;
      if (leanCanvas) {
        const data = JSON.parse(leanCanvas);
        const totalBlocks = 9;
        const completedBlocks = Object.values(data).filter(v => v && String(v).trim() !== '').length;
        leanCanvasProgress = Math.round((completedBlocks / totalBlocks) * 100);
      }

      let checklistProgress = 0;
      if (checklist) {
        const data = JSON.parse(checklist);
        const total = 5;
        checklistProgress = Math.round((data.completed / total) * 100);
      }

      setProgressData({
        validation: leanCanvasProgress,
        leanCanvas: leanCanvasProgress,
        legalChecklist: checklistProgress,
      });
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
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
    if (path === "/demo/emprendedor/dashboard") {
      // Already here
      return;
    }
    // For now, show placeholder
    navigate(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-purple-200">
        <div className="flex items-center gap-2 text-purple-600">
          <Lightbulb className="h-6 w-6" />
          <span className="font-bold text-lg">Emprendedor</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
              item.active
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-purple-50"
            )}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-200">
        <Button
          variant="outline"
          className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
          onClick={openRegisterModal}
        >
          Crear Cuenta
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-purple-50/30">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-50 p-4">
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
        <aside className="hidden md:block w-64 bg-white border-r border-purple-200 fixed h-screen">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard Emprendedor</h1>

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
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Progreso de Validación</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-purple-600">
                      {progressData.validation}%
                    </div>
                    <Progress value={progressData.validation} className="h-2" />
                    <p className="text-sm text-gray-600">
                      {progressData.validation === 0 ? "Todavía no empezaste" : "¡Vas muy bien!"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-pink-600" />
                    </div>
                    <CardTitle className="text-lg">Rentabilidad Estimada</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">Sin datos</div>
                    <p className="text-sm text-gray-600">
                      Completa el simulador para ver proyección
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckSquare className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Lean Canvas Completado</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((progressData.leanCanvas / 100) * 9)}/9 bloques
                    </div>
                    <Progress value={progressData.leanCanvas} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Trámites Legales</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((progressData.legalChecklist / 100) * 5)}/5 completados
                    </div>
                    <Progress value={progressData.legalChecklist} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* First Steps Checklist */}
            <Card className="border border-purple-200 mb-8">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ClipboardCheck className="h-6 w-6 text-purple-600" />
                  Tus Primeros Pasos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 1, text: "Valida tu idea completando el Lean Canvas" },
                    { id: 2, text: "Simula tu rentabilidad con números reales" },
                    { id: 3, text: "Completa el checklist de trámites iniciales" },
                    { id: 4, text: "Define misión y visión de tu emprendimiento" },
                    { id: 5, text: "Revisa los recursos y guías disponibles" },
                  ].map((step) => (
                    <div key={step.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                      <div className="w-5 h-5 rounded border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white px-8 py-6 text-lg"
                onClick={() => navigate('/demo/emprendedor/validacion-idea')}
              >
                Empezar Validación de Idea →
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
