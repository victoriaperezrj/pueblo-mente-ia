import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Users, Percent } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancialSimulator() {
  const navigate = useNavigate();
  
  const [precio, setPrecio] = useState(5000);
  const [clientes, setClientes] = useState(50);
  const [costosFijos, setCostosFijos] = useState(20000);
  const [margen, setMargen] = useState(40);

  const revenue = precio * clientes;
  const breakEven = Math.ceil(costosFijos / precio);
  const profit = revenue * (margen / 100) - costosFijos;

  const projectionData = Array.from({ length: 6 }, (_, i) => ({
    mes: `Mes ${i + 1}`,
    revenue: Math.round(revenue * (1 + i * 0.15)),
  }));

  const sliders = [
    {
      id: 'precio',
      label: 'Precio del producto/servicio',
      value: precio,
      setValue: setPrecio,
      min: 100,
      max: 10000,
      step: 100,
      color: 'from-green-500 to-emerald-600',
      prefix: '$',
      icon: DollarSign,
    },
    {
      id: 'clientes',
      label: 'Clientes por mes',
      value: clientes,
      setValue: setClientes,
      min: 1,
      max: 500,
      step: 5,
      color: 'from-blue-500 to-blue-600',
      suffix: ' clientes',
      icon: Users,
    },
    {
      id: 'costosFijos',
      label: 'Costos fijos mensuales',
      value: costosFijos,
      setValue: setCostosFijos,
      min: 0,
      max: 50000,
      step: 1000,
      color: 'from-orange-500 to-red-500',
      prefix: '$',
      icon: TrendingUp,
    },
    {
      id: 'margen',
      label: 'Margen objetivo',
      value: margen,
      setValue: setMargen,
      min: 10,
      max: 80,
      step: 5,
      color: 'from-purple-500 to-pink-500',
      suffix: '%',
      icon: Percent,
    },
  ];

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

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Simulador{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Financiero
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Proyecciones en tiempo real con sliders interactivos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Sliders */}
          <div className="space-y-6">
            {sliders.map((slider, i) => (
              <motion.div
                key={slider.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${slider.color} rounded-xl flex items-center justify-center`}>
                    <slider.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold text-gray-900 block">{slider.label}</label>
                    <span className="text-2xl font-bold text-gray-900">
                      {slider.prefix}{slider.value.toLocaleString()}{slider.suffix}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={slider.value}
                  onChange={(e) => slider.setValue(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e5e7eb ${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Right: Results */}
          <div className="space-y-6">
            {/* Result cards */}
            <div className="grid grid-cols-1 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <p className="text-sm font-medium text-gray-600 mb-1">Revenue mensual</p>
                <p className="text-3xl font-bold text-green-600">
                  ${revenue.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <p className="text-sm font-medium text-gray-600 mb-1">Clientes para break-even</p>
                <p className="text-3xl font-bold text-blue-600">
                  {breakEven} clientes
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100`}
              >
                <p className="text-sm font-medium text-gray-600 mb-1">Profit mensual</p>
                <p className={`text-3xl font-bold ${profit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  ${profit.toLocaleString()}
                </p>
              </motion.div>
            </div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-4">Proyección 6 meses</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={projectionData}>
                  <XAxis dataKey="mes" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #E5E7EB',
                      borderRadius: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
