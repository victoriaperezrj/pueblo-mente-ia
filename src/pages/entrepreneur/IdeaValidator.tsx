import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  Check,
  Sparkles,
  Download,
} from 'lucide-react';

const sharkQuestions = [
  "¿Por qué la gente pagaría por esto en lugar de las alternativas gratuitas que ya existen?",
  "¿Cuánto te costaría conseguir tu primer cliente? ¿Tenés ese presupuesto disponible ahora?",
  "Si tu competidor principal baja sus precios 50% mañana, ¿qué harías?",
  "¿Podés validar esta idea con $1000 USD en menos de 30 días? ¿Cómo lo harías exactamente?"
];

export default function IdeaValidator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [ideaDescription, setIdeaDescription] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [showResults, setShowResults] = useState(false);

  const viabilityScore = 72;
  const breakdown = [
    { label: 'Problema real', score: 85, color: 'blue' },
    { label: 'Tamaño de mercado', score: 70, color: 'green' },
    { label: 'Ventaja competitiva', score: 60, color: 'purple' },
    { label: 'Monetización', score: 75, color: 'orange' },
  ];

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/entrepreneur/dashboard')}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al dashboard
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-10 shadow-xl"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl"
              >
                <span className="text-5xl font-bold text-white">{viabilityScore}</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {viabilityScore >= 80 ? '🎉 ¡Idea prometedora!' :
                 viabilityScore >= 60 ? '💪 Tiene potencial' :
                 '⚠️ Necesita más trabajo'}
              </h2>
              <p className="text-gray-600 text-lg">
                Tu idea tiene {viabilityScore}% de viabilidad basado en tus respuestas
              </p>
            </div>

            <div className="mb-12">
              <h3 className="font-bold text-xl text-gray-900 mb-6">Análisis detallado:</h3>
              <div className="space-y-4">
                {breakdown.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="w-40 font-medium text-gray-700">{item.label}</span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full`}
                      />
                    </div>
                    <span className="w-12 text-right font-bold text-gray-900">{item.score}%</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 mb-8"
            >
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                Próximos pasos recomendados:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <span className="text-gray-700">
                    Hablá con 20 potenciales clientes esta semana usando estas preguntas: "¿Cuánto pagás ahora por resolver esto?" y "¿Qué te frustra más del proceso actual?"
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <span className="text-gray-700">
                    Creá un landing page con Carrd o Webflow en 2 días máximo. Incluí solo: problema, solución y CTA de "Lista de espera"
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <span className="text-gray-700">
                    Invertí $50 USD en ads de Facebook/Instagram durante 7 días para testear interés real. Meta: 30 clicks y 5 emails mínimo
                  </span>
                </li>
              </ul>
            </motion.div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar resultado (PDF)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowResults(false);
                  setCurrentStep(1);
                  setIdeaDescription('');
                  setAnswers(['', '', '', '']);
                }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Nueva validación
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/entrepreneur/dashboard')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Validador de Ideas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              IA
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Modo Shark Tank: La IA te hará 4 preguntas difíciles para validar tu idea
          </p>
        </div>

        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 5 && (
                <div className={`h-1 w-full mt-5 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <label className="block">
                <span className="text-lg font-semibold text-gray-900 mb-2 block">
                  Contanos tu idea en 3-5 líneas
                </span>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-900"
                  placeholder="Ejemplo: Una app que conecta personas con huertas urbanas para comprar verduras frescas directamente del productor..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                />
              </label>
              <motion.button
                onClick={() => setCurrentStep(2)}
                disabled={ideaDescription.trim().length < 50}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar
              </motion.button>
            </div>
          )}

          {currentStep >= 2 && currentStep <= 5 && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0"
                >
                  <Brain className="w-8 h-8" />
                </motion.div>
                <div className="flex-1 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border-l-4 border-red-500">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Pregunta {currentStep - 1} de 4:
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {sharkQuestions[currentStep - 2]}
                  </p>
                </div>
              </div>

              <textarea
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none text-gray-900"
                placeholder="Tu respuesta..."
                value={answers[currentStep - 2]}
                onChange={(e) => handleAnswerChange(currentStep - 2, e.target.value)}
              />

              <div className="flex gap-4">
                <motion.button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                  Anterior
                </motion.button>
                <motion.button
                  onClick={() => (currentStep === 5 ? handleSubmit() : setCurrentStep(currentStep + 1))}
                  disabled={!answers[currentStep - 2]?.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 5 ? 'Ver resultado' : 'Continuar'}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
