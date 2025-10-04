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
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Llegaste al límite del demo
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Ya usaste 20 acciones en modo demo. 
            <br />
            <strong>Creá una cuenta gratis</strong> para seguir usando la plataforma y guardar tu progreso.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg space-y-2 my-4">
          <p className="text-sm font-semibold">Con una cuenta podés:</p>
          <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
            <li>Guardar todos tus datos</li>
            <li>Acceder desde cualquier dispositivo</li>
            <li>Sin límites de uso</li>
            <li>Usar todas las herramientas de IA</li>
          </ul>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-auto border-2"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Borrar datos y reiniciar
          </Button>
          <Button
            onClick={onCreateAccount}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Crear cuenta gratis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
