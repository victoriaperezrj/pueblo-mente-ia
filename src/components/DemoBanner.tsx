import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DemoBanner() {
  return (
    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-900 mb-4">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="font-medium">
        Modo Demo - Los datos no se guardarán
      </AlertDescription>
    </Alert>
  );
}
