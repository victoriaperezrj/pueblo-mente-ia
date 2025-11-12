import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  Target,
  DollarSign,
  Users,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  color: string;
  prefix?: string;
  suffix?: string;
}

const sliders: SliderConfig[] = [
  { 
    id: 'precio',
    label: 'Precio del producto/servicio',
    min: 100,
    max: 10000,
    step: 100,
    color: 'from-green-500 to-emerald-600',
    prefix: '$'
  },
  { 
    id: 'clientes',
    label: 'Clientes por mes',
    min: 1,
    max: 500,
    step: 5,
    color: 'from-blue-500 to-blue-600',
    suffix: ' clientes'
  },
  { 
    id: 'costosFijos',
    label: 'Costos fijos mensuales',
    min: 0,
    max: 50000,
    step: 1000,
    color: 'from-orange-500 to-red-500',
    prefix: '$'
  },
  { 
    id: 'margen',
    label: 'Margen objetivo',
    min: 10,
    max: 80,
    step: 5,
    color: 'from-purple-500 to-pink-500',
    suffix: '%'
  }
];

export default function FinancialSimulator() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    precio: 1000,
    clientes: 50,
    costosFijos: 10000,
    margen: 40
  });

  const handleChange = (id: string, value: number) => {
    setValues(prev => ({ ...prev, [id]: value }));
  };

  // Cálculos en tiempo real
  const calculations = useMemo(() => {
    const revenueMensual = values.precio * values.clientes;
    const breakEven = Math.ceil(values.costosFijos / values.precio);
    const profitMensual = (revenueMensual * (values.margen / 100)) - values.costosFijos;
    
    // Proyección 6 meses con crecimiento del 15% mensual
    const proyeccion = Array.from({ length: 6 }, (_, i) => {
      const mes = i + 1;
      const growth = Math.pow(1.15, i);
      return {
        mes: `Mes ${mes}`,
        revenue: Math.round(revenueMensual * growth),
        profit: Math.round(profitMensual * growth)
      };
    });

    const revenueAcumulado = proyeccion.reduce((sum, item) => sum + item.revenue, 0);

    return {
      revenueMensual,
      breakEven,
      profitMensual,
      proyeccion,
      revenueAcumulado
    };
  }, [values]);

  const handleExport = () => {
    const text = `
SIMULACIÓN FINANCIERA
====================

PARÁMETROS:
- Precio: $${values.precio}
- Clientes/mes: ${values.clientes}
- Costos fijos: $${values.costosFijos}
- Margen objetivo: ${values.margen}%

RESULTADOS:
- Revenue mensual: $${calculations.revenueMensual.toLocaleString()}
- Break-even: ${calculations.breakEven} clientes
- Profit mensual: $${calculations.profitMensual.toLocaleString()}
- Revenue acumulado (6 meses): $${calculations.revenueAcumulado.toLocaleString()}

PROYECCIÓN 6 MESES:
${calculations.proyeccion.map(p => `${p.mes}: $${p.revenue.toLocaleString()}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(text);
    toast.success('Simulación copiada al portapapeles');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
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
          
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Simulador{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Financiero
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Ajustá los parámetros y mirá las proyecciones en tiempo real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Panel izquierdo: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Parámetros</h2>
            
            <div className="space-y-8">
              {sliders.map((slider) => (
                <div key={slider.id}>
                  <label className="flex justify-between mb-3">
                    <span className="font-semibold text-gray-900">{slider.label}</span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${slider.color} bg-clip-text text-transparent`}>
                      {slider.prefix}{values[slider.id as keyof typeof values]}{slider.suffix}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    value={values[slider.id as keyof typeof values]}
                    onChange={(e) => handleChange(slider.id, Number(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(var(--primary)) 0%, 
                        hsl(var(--primary)) ${((values[slider.id as keyof typeof values] - slider.min) / (slider.max - slider.min)) * 100}%, 
                        #e5e7eb ${((values[slider.id as keyof typeof values] - slider.min) / (slider.max - slider.min)) * 100}%, 
                        #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{slider.prefix}{slider.min}{slider.suffix}</span>
                    <span>{slider.prefix}{slider.max}{slider.suffix}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Panel derecho: Resultados */}
          <div className="space-y-6">
            
            {/* Card: Revenue mensual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold opacity-90">Revenue Mensual</span>
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-5xl font-bold mb-2">
                ${calculations.revenueMensual.toLocaleString()}
              </div>
              <div className="text-sm opacity-75">
                {values.clientes} clientes × ${values.precio}
              </div>
            </motion.div>

            {/* Card: Break-even */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Break-even</h3>
                  <p className="text-sm text-gray-600">Punto de equilibrio</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {calculations.breakEven} clientes
              </div>
              <p className="text-gray-600">
                Necesitas vender al menos esto para cubrir costos fijos
              </p>
            </motion.div>

            {/* Card: Profit mensual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-3xl p-8 shadow-xl ${
                calculations.profitMensual >= 0 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                  : 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold opacity-90">Profit Mensual</span>
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="text-5xl font-bold mb-2">
                ${Math.abs(calculations.profitMensual).toLocaleString()}
              </div>
              <div className="text-sm opacity-75">
                {calculations.profitMensual >= 0 ? '✓ Ganancia' : '✗ Pérdida'} con {values.margen}% de margen
              </div>
            </motion.div>

            {/* Card: Proyección 6 meses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
            >
              <h3 className="font-bold text-xl text-gray-900 mb-4">Proyección 6 meses</h3>
              
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={calculations.proyeccion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="mes" 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '2px solid #E5E7EB',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Revenue acumulado:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${calculations.revenueAcumulado.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Botón de exportar */}
            <Button 
              onClick={handleExport}
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:scale-105 transition-all"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Copiar simulación
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
