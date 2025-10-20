import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Building2 } from "lucide-react";
import { DemoBottomBar } from "@/components/DemoBottomBar";

export default function DemoIntro() {
  const navigate = useNavigate();
  const demoRole = sessionStorage.getItem('demoRole') || 'business';
  
  const handleNext = () => {
    if (demoRole === 'pyme') {
      navigate('/empresa/dashboard');
    } else if (demoRole === 'business') {
      navigate('/negocio/dashboard');
    } else {
      navigate('/demo/idea-capture');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-2.5 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Proyecto Emprendedurismo
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="border-2"
          >
            Iniciar Sesión
          </Button>
        </div>
      </header>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="max-w-2xl p-8 border-2 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Probá Proyecto Emprendedurismo
            </h1>
            <p className="text-lg text-muted-foreground">
              Vas a probar todas las funciones sin crear cuenta. 
              Nada de lo que hagas se va a guardar (es solo para que veas cómo funciona).
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Validá una idea</p>
                <p className="text-sm text-muted-foreground">
                  Probá cómo analizamos si tu negocio puede funcionar
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Mirá el simulador financiero</p>
                <p className="text-sm text-muted-foreground">
                  Jugá con los números para ver cuánta plata podés ganar
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Explorá el sistema de gestión</p>
                <p className="text-sm text-muted-foreground">
                  Cómo llevar ventas, gastos y clientes
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-2"
            >
              ¿Ya tenés cuenta? Iniciá sesión
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4 mb-20">
            Después podés crear tu cuenta si te gusta
          </p>
        </Card>
      </div>

      <DemoBottomBar
        onBack={() => navigate('/')}
        onNext={handleNext}
        backLabel="← VOLVER AL INICIO"
        nextLabel="SIGUIENTE PASO →"
        hideSkip
      />
    </div>
  );
}
