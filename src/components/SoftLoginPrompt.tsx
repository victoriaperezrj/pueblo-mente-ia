import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper } from "lucide-react";

interface SoftLoginPromptProps {
  trigger: 'products' | 'expenses' | 'customers';
  count: number;
}

const TRIGGER_THRESHOLDS = {
  products: 20,
  expenses: 10,
  customers: 10,
};

const TRIGGER_MESSAGES = {
  products: 'productos',
  expenses: 'gastos',
  customers: 'clientes',
};

export function SoftLoginPrompt({ trigger, count }: SoftLoginPromptProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const storageKey = `guest_popup_shown_${trigger}`;

  useEffect(() => {
    const alreadyShown = localStorage.getItem(storageKey) === 'true';
    const threshold = TRIGGER_THRESHOLDS[trigger];
    
    if (!alreadyShown && count >= threshold) {
      setOpen(true);
      localStorage.setItem(storageKey, 'true');
    }
  }, [count, trigger, storageKey]);

  const handleCreateAccount = () => {
    setOpen(false);
    navigate('/auth');
  };

  const handleContinueWithoutAccount = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-violet-100 to-blue-100 rounded-full p-3">
              <PartyPopper className="h-8 w-8 text-violet-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            🎉 ¡Excelente progreso!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Has cargado <span className="font-bold text-violet-600">{count} {TRIGGER_MESSAGES[trigger]}</span>. 
            Crea una cuenta para guardar en la nube y acceder desde cualquier dispositivo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleCreateAccount}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 text-white font-semibold"
            size="lg"
          >
            Crear Cuenta
          </Button>
          <Button
            onClick={handleContinueWithoutAccount}
            variant="ghost"
            className="w-full"
          >
            Continuar sin cuenta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
