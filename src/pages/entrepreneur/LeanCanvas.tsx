import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Save, Download, RefreshCw } from 'lucide-react';

const canvasBlocks = [
  { id: 'problem', title: 'Problema', color: 'from-red-500 to-red-600', placeholder: 'Top 3 problemas que resolvés' },
  { id: 'solution', title: 'Solución', color: 'from-blue-500 to-blue-600', placeholder: 'Top 3 características de tu solución' },
  { id: 'unique', title: 'Propuesta única', color: 'from-purple-500 to-purple-600', placeholder: '¿Por qué sos diferente?' },
  { id: 'advantage', title: 'Ventaja competitiva', color: 'from-green-500 to-green-600', placeholder: 'Algo que no te pueden copiar fácil' },
  { id: 'segments', title: 'Segmentos', color: 'from-orange-500 to-orange-600', placeholder: '¿Para quién es?' },
  { id: 'channels', title: 'Canales', color: 'from-cyan-500 to-cyan-600', placeholder: '¿Cómo llegás a ellos?' },
  { id: 'revenue', title: 'Ingresos', color: 'from-emerald-500 to-emerald-600', placeholder: '¿Cómo cobrás?' },
  { id: 'costs', title: 'Costos', color: 'from-pink-500 to-pink-600', placeholder: 'Costos principales' },
  { id: 'metrics', title: 'Métricas clave', color: 'from-indigo-500 to-indigo-600', placeholder: '¿Qué números medís?' },
];

export default function LeanCanvas() {
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<Record<string, string>>({});
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]>>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleBlockChange = (id: string, value: string) => {
    setCanvas(prev => ({ ...prev, [id]: value }));
  };

  const generateSuggestions = () => {
    setLoadingSuggestions(true);
    // Mock IA suggestions - en producción vendría de Claude API
    setTimeout(() => {
      setAiSuggestions({
        problem: [
          'Pérdida de tiempo buscando información dispersa',
          'Dificultad para organizar tareas y prioridades',
          'Falta de visibilidad del progreso del equipo'
        ],
        solution: [
          'Dashboard unificado con toda la info en un lugar',
          'Sistema de priorización automática con IA',
          'Vista en tiempo real del estado de cada tarea'
        ],
        unique: [
          'Única plataforma que unifica gestión + análisis + IA',
          'Interfaz tan simple que no requiere capacitación',
          'Precio 70% menor que competidores'
        ]
      });
      setLoadingSuggestions(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/entrepreneur/dashboard')}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al dashboard
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Lean Canvas{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-600">
                con IA
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Completá los bloques y pedí sugerencias a la IA
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateSuggestions}
            disabled={loadingSuggestions}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loadingSuggestions ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Sugerencias IA
              </>
            )}
          </motion.button>
        </div>

        {/* Canvas grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {canvasBlocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${block.color} text-white font-bold rounded-xl mb-4 text-sm`}>
                {block.title}
              </div>

              <textarea
                rows={5}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none text-sm text-gray-900"
                placeholder={block.placeholder}
                value={canvas[block.id] || ''}
                onChange={(e) => handleBlockChange(block.id, e.target.value)}
              />

              {/* Sugerencias IA */}
              {aiSuggestions[block.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-900">Sugerencias IA:</span>
                  </div>
                  <ul className="space-y-1">
                    {aiSuggestions[block.id].map((suggestion, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span className="flex-1">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar canvas
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-500 hover:text-purple-600 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar PDF
          </motion.button>
        </div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Pro tip:
          </h3>
          <p className="text-gray-700">
            Empezá por <strong>Problema</strong> y <strong>Segmentos</strong>. Si no podés definirlos claramente,
            tu idea necesita más validación. Después de completar esos dos, pedí sugerencias a la IA.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
