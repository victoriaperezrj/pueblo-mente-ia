import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Brain, 
  Lightbulb, 
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const sharkQuestions = [
  "¿Por qué la gente pagaría por esto en lugar de las alternativas gratuitas?",
  "¿Cuánto te costaría conseguir tu primer cliente? ¿Tenés ese presupuesto?",
  "Si tu competidor principal baja sus precios 50%, ¿qué harías?",
  "¿Podés validar esta idea con $1000 USD en menos de 30 días? ¿Cómo?"
];

interface ValidationResult {
  overallScore: number;
  categories: {
    label: string;
    score: number;
    color: string;
  }[];
  recommendations: string[];
}

export default function IdeaValidator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [ideaDescription, setIdeaDescription] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setWordCount(ideaDescription.split(' ').filter(w => w.length > 0).length);
  }, [ideaDescription]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Mock result - en producción llamaría a la API
    const mockResult: ValidationResult = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      categories: [
        { label: 'Problema real', score: 85, color: 'blue' },
        { label: 'Tamaño de mercado', score: 70, color: 'green' },
        { label: 'Ventaja competitiva', score: 60, color: 'purple' },
        { label: 'Monetización', score: 75, color: 'orange' },
      ],
      recommendations: [
        'Hablá con 20 potenciales clientes esta semana usando estas preguntas específicas...',
        'Creá un landing page con Carrd o Webflow en 2 días para validar interés...',
        'Invertí $50 USD en ads de Facebook/Instagram para testear demanda real...'
      ]
    };

    setResult(mockResult);
    setCurrentStep(6);

    // Confetti si score >= 80
    if (mockResult.overallScore >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleExport = () => {
    const text = `
VALIDACIÓN DE IDEA
==================

IDEA: ${ideaDescription}

PREGUNTAS Y RESPUESTAS:
${sharkQuestions.map((q, i) => `${i + 1}. ${q}\nR: ${answers[i]}\n`).join('\n')}

RESULTADO: ${result?.overallScore}%

CATEGORÍAS:
${result?.categories.map(c => `- ${c.label}: ${c.score}%`).join('\n')}

RECOMENDACIONES:
${result?.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(text);
    toast.success('Resultado copiado al portapapeles');
  };

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/emprendedor/dashboard')}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Validador de Ideas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              IA
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Modo Shark Tank: La IA te hará 4 preguntas difíciles para validar tu idea
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
            <span>Paso {currentStep} de {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
              </motion.div>
              {step < 6 && (
                <div className={`h-1 w-full mt-5 ${currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100"
        >
          
          {/* Paso 1: Descripción de la idea */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tu Idea</h2>
                  <p className="text-gray-600">Contanos en 3-5 líneas</p>
                </div>
              </div>

              <label className="block">
                <span className="text-lg font-semibold text-gray-900 mb-2 block">
                  Descripción de tu idea
                </span>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-900"
                  placeholder="Ejemplo: Una app que conecta personas con huertas urbanas para comprar verduras frescas directamente del productor..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className={`${wordCount < 20 ? 'text-orange-500' : 'text-green-500'}`}>
                    {wordCount} palabras {wordCount < 20 && '(mínimo 20)'}
                  </span>
                  <span className="text-gray-500">
                    {ideaDescription.length} caracteres
                  </span>
                </div>
              </label>

              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={wordCount < 20}
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Pasos 2-5: Preguntas del "Tiburón" */}
          {currentStep >= 2 && currentStep <= 5 && (
            <div className="space-y-6">
              {/* Avatar del "Tiburón" */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-start gap-4"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                >
                  <Brain className="w-8 h-8" />
                </motion.div>
                <div className="flex-1 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-l-4 border-red-500">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Pregunta {currentStep - 1} de 4:
                  </p>
                  <p className="text-gray-700 text-lg">
                    {sharkQuestions[currentStep - 2]}
                  </p>
                </div>
              </motion.div>

              {/* Respuesta del usuario */}
              <div>
                <label className="block mb-2">
                  <span className="text-lg font-semibold text-gray-900">Tu respuesta:</span>
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-900"
                  placeholder="Sé específico y realista..."
                  value={answers[currentStep - 2]}
                  onChange={(e) => handleAnswerChange(currentStep - 2, e.target.value)}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-8 py-6 text-lg border-2"
                  size="lg"
                >
                  Anterior
                </Button>
                <Button 
                  onClick={() => currentStep === 5 ? handleSubmit() : setCurrentStep(currentStep + 1)}
                  disabled={!answers[currentStep - 2]?.trim()}
                  className="flex-1 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                  size="lg"
                >
                  {currentStep === 5 ? 'Ver resultado' : 'Continuar'}
                </Button>
              </div>
            </div>
          )}

          {/* Paso 6: Resultado */}
          {currentStep === 6 && result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Score principal */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    damping: 10,
                    stiffness: 100
                  }}
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl"
                >
                  <span className="text-5xl font-bold text-white">{result.overallScore}</span>
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {result.overallScore >= 80 ? '🎉 ¡Idea prometedora!' : 
                   result.overallScore >= 60 ? '💪 Tiene potencial' : 
                   '⚠️ Necesita más trabajo'}
                </h2>
                <p className="text-gray-600 text-lg">
                  Tu idea tiene {result.overallScore}% de viabilidad basado en tus respuestas
                </p>
              </div>

              {/* Breakdown por categoría */}
              <div className="space-y-4">
                <h3 className="font-bold text-xl text-gray-900 mb-4">Análisis detallado:</h3>
                
                {result.categories.map((category, index) => (
                  <motion.div
                    key={category.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="w-40 font-medium text-gray-700">{category.label}</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.score}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="w-12 text-right font-bold text-gray-900">{category.score}%</span>
                  </motion.div>
                ))}
              </div>

              {/* Recomendaciones */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-500" />
                  Próximos pasos recomendados:
                </h3>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  onClick={handleExport}
                  className="flex-1 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Copiar resultado
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setCurrentStep(1);
                    setIdeaDescription('');
                    setAnswers(['', '', '', '']);
                    setResult(null);
                  }}
                  className="px-8 py-6 text-lg border-2"
                  size="lg"
                >
                  Nueva validación
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
