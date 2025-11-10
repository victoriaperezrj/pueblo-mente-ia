import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Lightbulb, TrendingUp, Target, Download, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const SHARK_QUESTIONS = [
  "¿Quién es tu cliente ideal y cuál es el problema específico que resuelve tu producto? Necesito nombres, números y situaciones reales.",
  "¿Cuánto están dispuestos a pagar tus clientes por esta solución? ¿Cómo lo sabes? Dame evidencia concreta, no suposiciones.",
  "¿Qué competidores existen hoy? ¿Por qué los clientes dejarían lo que usan ahora para comprarte a vos?",
  "¿Cuánto dinero necesitás para lanzar y llegar a los primeros 100 clientes? Desglósalo: equipo, marketing, desarrollo.",
  "Si tuvieras que validar esta idea gastando solo $1000 y en 2 semanas, ¿qué harías exactamente? Paso por paso."
];

interface AnalysisResult {
  viabilityScore: number;
  categories: {
    problema: number;
    mercado: number;
    competencia: number;
    monetizacion: number;
  };
  recommendations: string[];
  nextSteps: string[];
}

export default function IdeaValidation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [ideaDescription, setIdeaDescription] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-idea', {
        body: {
          idea: ideaDescription,
          answers: answers,
          mode: 'shark-tank'
        }
      });

      if (error) throw error;

      setResult(data);
      setCurrentStep(6);
      
      if (data.viabilityScore >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error al analizar la idea. Por favor, intentá de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      problema: 'from-blue-500 to-blue-600',
      mercado: 'from-green-500 to-emerald-600',
      competencia: 'from-purple-500 to-purple-600',
      monetizacion: 'from-orange-500 to-red-500'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/entrepreneur/dashboard')} 
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver al dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Validador de Ideas 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> IA</span>
          </h1>
          <p className="text-muted-foreground">
            Modo Shark Tank: La IA te hará 5 preguntas difíciles para validar tu idea
          </p>
        </div>

        {/* Step Indicator */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between mb-8 px-4">
            {[0, 1, 2, 3, 4, 5].map((step, index) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step + 1}
                </div>
                {index < 5 && (
                  <div className={`w-full h-1 mt-5 transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Paso 0: Descripción de la idea */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-3xl p-6 md:p-10 shadow-2xl border"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Contanos tu idea</h2>
                    <p className="text-muted-foreground">Describila en 3-5 líneas</p>
                  </div>
                </div>

                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all resize-none bg-background"
                  placeholder="Ejemplo: Una app que conecta personas con huertas urbanas para comprar verduras frescas directamente del productor..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                />
                
                <button 
                  onClick={() => setCurrentStep(1)}
                  disabled={!ideaDescription.trim() || ideaDescription.length < 50}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Continuar al interrogatorio
                </button>
                
                {ideaDescription.trim() && ideaDescription.length < 50 && (
                  <p className="text-sm text-orange-600 text-center">
                    Necesitamos más detalles (mínimo 50 caracteres)
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Pasos 1-5: Preguntas del "Tiburón" */}
          {currentStep >= 1 && currentStep <= 5 && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card rounded-3xl p-6 md:p-10 shadow-2xl border"
            >
              <div className="space-y-6">
                {/* Avatar del "Tiburón" */}
                <div className="flex items-start gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                  >
                    <Brain className="w-8 h-8" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-l-4 border-red-500"
                  >
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Pregunta {currentStep} de 5:
                    </p>
                    <p className="text-foreground/80">
                      {SHARK_QUESTIONS[currentStep - 1]}
                    </p>
                  </motion.div>
                </div>

                {/* Respuesta del usuario */}
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all resize-none bg-background"
                  placeholder="Tu respuesta..."
                  value={answers[currentStep - 1]}
                  onChange={(e) => handleAnswerChange(currentStep - 1, e.target.value)}
                  autoFocus
                />

                {/* Botones */}
                <div className="flex gap-4">
                  <button 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8 py-4 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary transition-all"
                  >
                    Anterior
                  </button>
                  <button 
                    onClick={() => currentStep === 5 ? handleSubmit() : setCurrentStep(currentStep + 1)}
                    disabled={!answers[currentStep - 1]?.trim() || isAnalyzing}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Analizando...
                      </>
                    ) : (
                      currentStep === 5 ? 'Ver resultado' : 'Continuar'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Paso 6: Resultado */}
          {currentStep === 6 && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Score principal */}
              <div className="bg-card rounded-3xl p-10 shadow-2xl border text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl"
                >
                  <span className="text-5xl font-bold text-white">{result.viabilityScore}</span>
                </motion.div>
                <h2 className="text-3xl font-bold mb-2">
                  {result.viabilityScore >= 80 ? '🎉 ¡Idea prometedora!' : 
                   result.viabilityScore >= 60 ? '💪 Tiene potencial' : 
                   '⚠️ Necesita más trabajo'}
                </h2>
                <p className="text-muted-foreground text-lg">
                  Tu idea tiene {result.viabilityScore}% de viabilidad basado en tus respuestas
                </p>
              </div>

              {/* Breakdown por categoría */}
              <div className="bg-card rounded-3xl p-8 shadow-xl border">
                <h3 className="font-bold text-xl mb-6">Análisis detallado:</h3>
                
                <div className="space-y-4">
                  {Object.entries(result.categories).map(([key, score]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground capitalize">
                          {key === 'problema' ? 'Problema real' : 
                           key === 'mercado' ? 'Tamaño de mercado' :
                           key === 'competencia' ? 'Ventaja competitiva' : 'Monetización'}
                        </span>
                        <span className="font-bold text-foreground">{score}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full bg-gradient-to-r ${getCategoryColor(key)} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Próximos pasos */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border-2 border-blue-200">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Próximos pasos recomendados:
                </h3>
                <ul className="space-y-4">
                  {result.nextSteps.map((step, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-foreground/80 pt-1">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => {
                    setCurrentStep(0);
                    setIdeaDescription("");
                    setAnswers(["", "", "", "", ""]);
                    setResult(null);
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  Nueva validación
                </button>
                <button className="px-8 py-4 border-2 border-border text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Exportar PDF
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
