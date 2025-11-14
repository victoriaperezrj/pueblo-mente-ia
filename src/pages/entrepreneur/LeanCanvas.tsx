import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Save } from 'lucide-react';

const canvasBlocks = [
  {
    id: 'problema',
    title: 'Problema',
    placeholder: 'Top 3 problemas que resuelves',
    color: 'from-red-50 to-red-100',
    borderColor: 'border-red-300',
  },
  {
    id: 'segmentos',
    title: 'Segmentos de Clientes',
    placeholder: '¿Quiénes son tus usuarios ideales?',
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
  },
  {
    id: 'propuesta',
    title: 'Propuesta de Valor Única',
    placeholder: '¿Por qué sos diferente?',
    color: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
  },
  {
    id: 'solucion',
    title: 'Solución',
    placeholder: 'Top 3 features de tu producto',
    color: 'from-green-50 to-green-100',
    borderColor: 'border-green-300',
  },
  {
    id: 'canales',
    title: 'Canales',
    placeholder: '¿Cómo llegas a tus clientes?',
    color: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-300',
  },
  {
    id: 'ingresos',
    title: 'Flujos de Ingresos',
    placeholder: '¿Cómo vas a ganar dinero?',
    color: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-300',
  },
  {
    id: 'costos',
    title: 'Estructura de Costos',
    placeholder: '¿Cuáles son tus costos principales?',
    color: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-300',
  },
  {
    id: 'metricas',
    title: 'Métricas Clave',
    placeholder: '¿Qué números importan?',
    color: 'from-cyan-50 to-cyan-100',
    borderColor: 'border-cyan-300',
  },
  {
    id: 'ventaja',
    title: 'Ventaja Competitiva',
    placeholder: '¿Qué no pueden copiar fácilmente?',
    color: 'from-pink-50 to-pink-100',
    borderColor: 'border-pink-300',
  },
];

export default function LeanCanvas() {
  const navigate = useNavigate();
  const [canvasData, setCanvasData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('leanCanvas');
    if (savedData) {
      setCanvasData(JSON.parse(savedData));
    }
  }, []);

  const updateBlock = (id: string, value: string) => {
    const newData = { ...canvasData, [id]: value };
    setCanvasData(newData);
    localStorage.setItem('leanCanvas', JSON.stringify(newData));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const completedBlocks = Object.values(canvasData).filter(v => v.trim()).length;
  const progress = Math.round((completedBlocks / canvasBlocks.length) * 100);

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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                IA
              </span>
            </h1>
            <p className="text-gray-600 text-lg">
              Canvas pre-llenado con sugerencias inteligentes de IA
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">{progress}%</div>
            <div className="text-sm text-gray-600">Completado</div>
          </div>
        </div>

        <div className="mb-4 bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              Guardado automáticamente
            </span>
          </div>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-600"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Guardado</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canvasBlocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-gradient-to-br ${block.color} rounded-2xl p-6 shadow-lg border-2 ${block.borderColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{block.title}</h3>
                {canvasData[block.id]?.trim() && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </div>
              <textarea
                rows={6}
                className="w-full px-3 py-2 bg-white/70 border border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none text-gray-900 text-sm"
                placeholder={block.placeholder}
                value={canvasData[block.id] || ''}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                maxLength={500}
              />
              <div className="mt-2 text-right text-xs text-gray-500">
                {(canvasData[block.id] || '').length}/500
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
