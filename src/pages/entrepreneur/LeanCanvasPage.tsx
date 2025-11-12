import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CanvasBlock {
  id: number;
  title: string;
  placeholder: string;
  color: string;
  borderColor: string;
}

const canvasBlocks: CanvasBlock[] = [
  { 
    id: 1, 
    title: 'Problema', 
    placeholder: 'Top 3 problemas que resuelves',
    color: 'from-red-50 to-red-100',
    borderColor: 'border-red-300'
  },
  { 
    id: 2, 
    title: 'Segmentos de Clientes', 
    placeholder: '¿Quiénes son tus usuarios ideales?',
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300'
  },
  { 
    id: 3, 
    title: 'Propuesta de Valor Única', 
    placeholder: '¿Por qué sos diferente?',
    color: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300'
  },
  { 
    id: 4, 
    title: 'Solución', 
    placeholder: 'Top 3 features de tu producto',
    color: 'from-green-50 to-green-100',
    borderColor: 'border-green-300'
  },
  { 
    id: 5, 
    title: 'Canales', 
    placeholder: '¿Cómo llegas a tus clientes?',
    color: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-300'
  },
  { 
    id: 6, 
    title: 'Flujos de Ingresos', 
    placeholder: '¿Cómo vas a ganar dinero?',
    color: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-300'
  },
  { 
    id: 7, 
    title: 'Estructura de Costos', 
    placeholder: '¿Cuáles son tus costos principales?',
    color: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-300'
  },
  { 
    id: 8, 
    title: 'Métricas Clave', 
    placeholder: '¿Qué números importan?',
    color: 'from-cyan-50 to-cyan-100',
    borderColor: 'border-cyan-300'
  },
  { 
    id: 9, 
    title: 'Ventaja Competitiva', 
    placeholder: '¿Qué no pueden copiar fácilmente?',
    color: 'from-pink-50 to-pink-100',
    borderColor: 'border-pink-300'
  }
];

export default function LeanCanvasPage() {
  const navigate = useNavigate();
  const [canvasData, setCanvasData] = useState<Record<number, string>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lean_canvas_data');
    if (saved) {
      setCanvasData(JSON.parse(saved));
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(canvasData).length > 0) {
      localStorage.setItem('lean_canvas_data', JSON.stringify(canvasData));
      setLastSaved(new Date());
    }
  }, [canvasData]);

  const handleChange = (id: number, value: string) => {
    setCanvasData(prev => ({ ...prev, [id]: value }));
  };

  const getCharCount = (id: number) => {
    return canvasData[id]?.length || 0;
  };

  const isBlockComplete = (id: number) => {
    return (canvasData[id]?.trim().length || 0) > 20;
  };

  const completionPercentage = Math.round(
    (canvasBlocks.filter(b => isBlockComplete(b.id)).length / canvasBlocks.length) * 100
  );

  const handleExport = () => {
    const text = `
LEAN CANVAS
===========

${canvasBlocks.map(block => `
${block.title.toUpperCase()}:
${canvasData[block.id] || '(vacío)'}
`).join('\n')}
    `;
    
    navigator.clipboard.writeText(text);
    toast.success('Lean Canvas copiado al portapapeles');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
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
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Lean Canvas{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                IA
              </span>
            </h1>
            
            <div className="flex items-center gap-4">
              {lastSaved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Save className="w-4 h-4 text-green-500" />
                  <span>Guardado {lastSaved.toLocaleTimeString()}</span>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-lg">
              Estructurá tu modelo de negocio en 9 bloques esenciales
            </p>
            
            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-purple-600">{completionPercentage}%</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {canvasBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br ${block.color} rounded-2xl p-6 shadow-lg border-2 ${block.borderColor} 
                         hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative group`}
            >
              {/* Complete indicator */}
              {isBlockComplete(block.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 mb-3">{block.title}</h3>

              {/* Textarea */}
              <textarea
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none bg-white/80 backdrop-blur-sm text-gray-900"
                placeholder={block.placeholder}
                value={canvasData[block.id] || ''}
                onChange={(e) => handleChange(block.id, e.target.value)}
                maxLength={500}
              />

              {/* Character count */}
              <div className="mt-2 flex justify-between items-center text-sm">
                <span className={`${getCharCount(block.id) > 20 ? 'text-green-600' : 'text-orange-500'}`}>
                  {getCharCount(block.id) > 20 ? '✓ Completo' : `${getCharCount(block.id)} / 500`}
                </span>
                <span className="text-gray-500">
                  {500 - getCharCount(block.id)} restantes
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={handleExport}
            disabled={completionPercentage < 50}
            className="px-8 py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Copiar Lean Canvas
          </Button>

          <Button 
            variant="outline"
            onClick={() => {
              if (window.confirm('¿Estás seguro? Esto borrará todo el contenido.')) {
                setCanvasData({});
                localStorage.removeItem('lean_canvas_data');
                toast.success('Lean Canvas reiniciado');
              }
            }}
            className="px-8 py-6 text-lg border-2"
            size="lg"
          >
            Reiniciar
          </Button>
        </div>

        {/* Info footer */}
        {completionPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-lg"
          >
            <p className="text-gray-700 text-center">
              💡 <strong>Tip:</strong> Completá al menos 20 caracteres en cada bloque para un Canvas efectivo.
              Tu progreso se guarda automáticamente.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
