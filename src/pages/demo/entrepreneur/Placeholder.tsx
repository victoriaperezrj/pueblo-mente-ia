import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Construction, Lightbulb, LayoutDashboard, Calculator, ClipboardCheck, FileText, BookOpen, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function DemoEntrepreneurPlaceholder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('lean-canvas')) return 'Lean Canvas';
    if (path.includes('recursos')) return 'Recursos y Guías';
    if (path.includes('configuracion')) return 'Configuración';
    if (path.includes('documentacion')) return 'Mi Documentación';
    return 'Próximamente';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/demo/emprendedor/dashboard" },
    { icon: Lightbulb, label: "Validación de Idea", path: "/demo/emprendedor/validacion-idea" },
    { icon: FileText, label: "Lean Canvas", path: "/demo/emprendedor/lean-canvas" },
    { icon: Calculator, label: "Simulador Financiero", path: "/demo/emprendedor/simulador" },
    { icon: ClipboardCheck, label: "Checklist de Trámites", path: "/demo/emprendedor/checklist" },
    { icon: BookOpen, label: "Recursos y Guías", path: "/demo/emprendedor/recursos" },
    { icon: Settings, label: "Configuración", path: "/demo/emprendedor/configuracion" },
  ];

  const Sidebar = () => (
    <div className={`fixed top-0 left-0 h-full bg-purple-50 border-r border-purple-100 transition-all duration-300 z-50 ${
      sidebarOpen ? 'w-64' : 'w-0 md:w-64'
    } overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-purple-900">Emprendedor</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-purple-100 text-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <Button
          onClick={() => navigate('/auth')}
          variant="outline"
          className="w-full mt-8 border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          Crear Cuenta
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Sidebar />
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden mb-4 p-2 rounded-lg bg-purple-600 text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Button>

          <Card className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <Construction className="w-12 h-12 text-purple-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{getPageTitle()}</h1>
            <p className="text-lg text-gray-600 mb-8">
              🚧 Esta funcionalidad estará disponible pronto
            </p>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-purple-900 mb-3">Mientras tanto, explorá:</h3>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Validación de Idea con IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  <span>Simulador Financiero</span>
                </li>
                <li className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Checklist de Trámites AFIP</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/demo/emprendedor/dashboard')}
                variant="outline"
                size="lg"
              >
                Volver al Dashboard
              </Button>
              <Button
                onClick={() => navigate('/demo/emprendedor/validacion-idea')}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Ir a Validación de Idea
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
