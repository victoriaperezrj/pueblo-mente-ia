import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "@/contexts/DemoContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket, CheckCircle2 } from "lucide-react";

const DemoStart = () => {
  const navigate = useNavigate();
  const { enterDemoMode } = useDemo();

  useEffect(() => {
    // Entrar en modo demo automáticamente
    enterDemoMode();

    // Redirigir al dashboard después de 2 segundos
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [enterDemoMode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="max-w-md w-full border-2 border-green-500 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-4 shadow-lg animate-bounce">
              <Rocket className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            ¡Bienvenido al Demo!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span>Acceso completo a todas las funcionalidades</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span>Sin necesidad de crear cuenta</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span>Podés cargar hasta 20 items para probar</span>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800 font-medium">
              Los datos del demo no se guardan permanentemente
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Cargando tu demo...</span>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            Ir al Dashboard →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoStart;
