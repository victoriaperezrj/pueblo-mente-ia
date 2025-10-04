import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/contexts/DemoContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export function DemoBanner() {
  const { itemCount, maxItems, resetDemo, exitDemoMode } = useDemo();
  const navigate = useNavigate();
  const [showLimitModal, setShowLimitModal] = useState(false);
  const isNearLimit = itemCount >= maxItems * 0.8; // 80% del límite
  const isAtLimit = itemCount >= maxItems;

  const handleCreateAccount = () => {
    exitDemoMode();
    navigate("/auth");
  };

  const handleResetDemo = () => {
    resetDemo();
    setShowLimitModal(false);
    window.location.reload(); // Recargar para limpiar estado
  };

  // Si llegó al límite, mostrar el modal
  if (isAtLimit && !showLimitModal) {
    setShowLimitModal(true);
  }

  return (
    <>
      <Alert className={`${isNearLimit ? 'bg-orange-50 border-orange-300 text-orange-900' : 'bg-yellow-50 border-yellow-300 text-yellow-900'} mb-4 sticky top-0 z-50 shadow-md`}>
        <AlertCircle className={`h-5 w-5 ${isNearLimit ? 'text-orange-600' : 'text-yellow-600'}`} />
        <AlertDescription className="flex items-center justify-between gap-4 font-medium">
          <div className="flex-1">
            <span className="font-bold">Modo Demo</span> - Los datos no se guardan. 
            <span className={`ml-2 ${isNearLimit ? 'font-bold text-orange-700' : ''}`}>
              {itemCount}/{maxItems} items cargados
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleCreateAccount}
            className="bg-green-600 hover:bg-green-700 text-white shrink-0"
          >
            Crear cuenta gratis
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎯 Llegaste al límite del demo</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Cargaste {maxItems} items. Para seguir usando la app y guardar tu progreso permanentemente, creá una cuenta gratis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleCreateAccount}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-bold"
            >
              ✓ Crear Cuenta Gratis
            </Button>
            <Button
              onClick={handleResetDemo}
              variant="outline"
              className="w-full py-6"
            >
              Borrar datos y empezar de nuevo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
