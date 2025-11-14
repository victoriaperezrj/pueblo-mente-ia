import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, AlertCircle, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function FinancialSimulator() {
  const navigate = useNavigate();

  // State para sliders
  const [initialInvestment, setInitialInvestment] = useState(5000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(2000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(1500);
  const [growthRate, setGrowthRate] = useState(15);

  // Calcular proyecciones
  const calculateProjections = () => {
    const months = 12;
    const data = [];
    let revenue = monthlyRevenue;
    let expenses = monthlyExpenses;
    let balance = -initialInvestment;

    for (let i = 0; i <= months; i++) {
      balance += revenue - expenses;
      data.push({
        month: `Mes ${i}`,
        revenue: Math.round(revenue),
        expenses: Math.round(expenses),
        balance: Math.round(balance),
        profit: Math.round(revenue - expenses),
      });
      revenue *= (1 + growthRate / 100);
      expenses *= 1.02; // 2% crecimiento mensual en gastos
    }
    return data;
  };

  const projections = calculateProjections();
  const breakEvenMonth = projections.findIndex(p => p.balance >= 0);
  const finalBalance = projections[projections.length - 1].balance;

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
            Simulador Financiero{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Interactivo
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Moviendo los sliders ves proyecciones en tiempo real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Panel de controles */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Parámetros</h2>

            <div className="space-y-8">
              {/* Inversión inicial */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Inversión inicial</label>
                  <span className="text-2xl font-bold text-blue-600">${initialInvestment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$50,000</span>
                </div>
              </div>

              {/* Ingresos mensuales */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Ingresos mes 1</label>
                  <span className="text-2xl font-bold text-green-600">${monthlyRevenue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Gastos mensuales */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Gastos mes 1</label>
                  <span className="text-2xl font-bold text-red-600">${monthlyExpenses.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Tasa de crecimiento */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-gray-700">Crecimiento mensual</label>
                  <span className="text-2xl font-bold text-purple-600">{growthRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            {/* Métricas clave */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Break-even</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {breakEvenMonth === -1 ? '12+ meses' : `${breakEvenMonth} meses`}
                </span>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Año 1</span>
                </div>
                <span className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${finalBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Gráfico de proyección */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Proyección a 12 meses</h2>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projections}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Ingresos" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpenses)" name="Gastos" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Balance acumulado */}
            <div className="mt-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Balance acumulado</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px'
                    }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Balance" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Alerta/Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 shadow-lg border-2 ${
            finalBalance >= 0
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
              : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
          }`}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className={`w-8 h-8 flex-shrink-0 ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                {finalBalance >= 0 ? '✅ Proyección positiva' : '⚠️ Requiere ajustes'}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {finalBalance >= 0
                  ? `Con estos números, alcanzarías el break-even en ${breakEvenMonth} meses y cerrarías el primer año con $${finalBalance.toLocaleString()} en caja. Recomendación: validá estos supuestos con datos reales del mercado.`
                  : `Con estos números, perderías $${Math.abs(finalBalance).toLocaleString()} en el primer año. Recomendación: necesitás ${monthlyRevenue < monthlyExpenses ? 'subir ingresos o bajar gastos' : 'más capital inicial'} para sostenerte.`
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Botón exportar */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar proyección (Excel)
        </motion.button>
      </div>
    </div>
  );
}
