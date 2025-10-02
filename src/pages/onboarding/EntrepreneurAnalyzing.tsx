import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { generateSimulatedAnalysis } from "@/utils/businessAnalysis";

const ANALYSIS_DURATION = 10000; // 10 segundos
const MESSAGE_ROTATION_INTERVAL = 3000; // 3 segundos

const analysisMessages = [
  "🔍 Analizando competencia en la zona...",
  "📊 Evaluando viabilidad del mercado...",
  "💰 Calculando inversión inicial...",
  "📍 Revisando densidad poblacional...",
  "⚖️ Verificando regulaciones provinciales...",
  "🎯 Identificando tu nicho óptimo...",
  "📈 Proyectando ingresos potenciales...",
  "✨ Generando recomendaciones personalizadas..."
];

const EntrepreneurAnalyzing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const ideaId = searchParams.get("ideaId");

  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Verificar que existe ideaId
    if (!ideaId) {
      toast({
        title: "Error",
        description: "No se encontró el ID de la idea",
        variant: "destructive",
      });
      navigate("/onboarding/entrepreneur/step1");
      return;
    }

    // Verificar que la idea existe y pertenece al usuario
    const verifyIdea = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: idea, error } = await supabase
          .from('business_ideas')
          .select('*')
          .eq('id', ideaId)
          .eq('user_id', user.id)
          .single();

        if (error || !idea) {
          toast({
            title: "Error",
            description: "No se encontró la idea o no tenés permiso para verla",
            variant: "destructive",
          });
          navigate("/onboarding/entrepreneur/step1");
          return;
        }

        // Iniciar el proceso de análisis
        startAnalysis(idea);
      } catch (error) {
        console.error('Error verifying idea:', error);
        navigate("/onboarding/entrepreneur/step1");
      }
    };

    verifyIdea();
  }, [ideaId, navigate, toast]);

  const startAnalysis = async (idea: any) => {
    // Animación de la barra de progreso (0-100% en 10 segundos)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, ANALYSIS_DURATION / 100);

    // Rotación de mensajes cada 3 segundos
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % analysisMessages.length);
    }, MESSAGE_ROTATION_INTERVAL);

    // Generar análisis simulado
    try {
      const simulatedResult = generateSimulatedAnalysis(
        idea.industry,
        idea.location,
        idea.idea_description
      );

      // Guardar el resultado después de 10 segundos
      setTimeout(async () => {
        try {
          const { error } = await supabase
            .from('business_ideas')
            .update({
              validation_result: simulatedResult as any,
            })
            .eq('id', ideaId);

          if (error) throw error;

          // Limpiar intervalos
          clearInterval(progressInterval);
          clearInterval(messageInterval);

          setIsProcessing(false);

          // Redirigir a resultados
          navigate(`/onboarding/entrepreneur/results?ideaId=${ideaId}`);
        } catch (error: any) {
          console.error('Error saving analysis:', error);
          toast({
            title: "Error",
            description: "No se pudo completar el análisis",
            variant: "destructive",
          });
          navigate("/onboarding/entrepreneur/step1");
        }
      }, ANALYSIS_DURATION);
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el análisis",
        variant: "destructive",
      });
      navigate("/onboarding/entrepreneur/step1");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-secondary/5 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-accent/10 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-2xl space-y-12 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-primary bg-clip-text text-transparent">
            Emprendu
          </h1>
        </div>

        {/* Spinner con gradient */}
        <div className="flex justify-center">
          <div className="relative">
            <Loader2 
              className="w-20 h-20 animate-spin text-primary" 
              strokeWidth={2.5}
            />
            <div className="absolute inset-0 blur-xl opacity-50">
              <Loader2 
                className="w-20 h-20 animate-spin text-primary" 
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        {/* Título */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold animate-fade-in">
            Analizando tu idea...
          </h2>
          
          {/* Mensaje rotativo */}
          <div className="min-h-[32px] flex items-center justify-center">
            <p 
              key={currentMessageIndex}
              className="text-lg md:text-xl text-muted-foreground animate-fade-in"
            >
              {analysisMessages[currentMessageIndex]}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-3">
          <Progress 
            value={progress} 
            className="h-3 transition-all duration-300"
          />
          <p className="text-center text-sm text-muted-foreground">
            {progress}% completado
          </p>
        </div>

        {/* Información adicional */}
        <div className="text-center space-y-2 opacity-70">
          <p className="text-sm text-muted-foreground">
            Estamos procesando más de 20 factores para darte el mejor análisis
          </p>
          <p className="text-xs text-muted-foreground">
            Esto tomará aproximadamente 10 segundos
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurAnalyzing;
