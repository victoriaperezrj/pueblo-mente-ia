import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, RotateCcw } from "lucide-react";

interface DemoUpgradePromptProps {
  open: boolean;
  onCreateAccount: () => void;
  onReset: () => void;
}

export function DemoUpgradePrompt({ open, onCreateAccount, onReset }: DemoUpgradePromptProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="h-6 w-6 text-primary" />
            ¡Ya cargaste bastante! 🚀
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Has explorado mucho el demo. ¿Querés crear una cuenta y guardar tu progreso?
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg space-y-2 my-4">
          <p className="text-sm font-semibold">Con una cuenta podés:</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Guardá tu progreso de forma segura</li>
            <li>Accedé a herramientas avanzadas</li>
            <li>Sin límites de funcionalidades</li>
            <li>Usá todas las herramientas de IA</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto border-2"
          >
            Seguir en demo
          </Button>
          <Button
            onClick={onCreateAccount}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Crear cuenta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
