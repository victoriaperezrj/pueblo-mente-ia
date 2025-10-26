// src/pages/DashboardPages/BusinessDashboard.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ToolsGrid } from '@/components/dashboard/ToolsGrid';
// import { useUser } from '@/hooks/useUser';

// Mock de useUser para evitar errores de compilación si no existe
const useUser = () => ({
  profile: { full_name: 'Usuario' }
});

// Mock Data
const salesData = [
  { month: 'Ene', sales: 4000, target: 5000 },
  { month: 'Feb', sales: 5200, target: 5000 },
  { month: 'Mar', sales: 4800, target: 5000 },
  { month: 'Abr', sales: 6100, target: 5000 },
  { month: 'May', sales: 7200, target: 5000 },
  { month: 'Jun', sales: 8500, target: 5000 },
];

const customerData = [
  { name: 'Clientes activos', value: 145, fill: '#3B82F6' },
  { name: 'Nuevos', value: 32, fill: '#10B981' },
  { name: 'En riesgo', value: 8, fill: '#F97316' },
];

const businessTools = [
  {
    id: 1,
    icon: '💵',
    name: 'Optimizador de Precios',
    description: 'Calcula precios óptimos con márgenes',
    path: '/tools/price-optimizer',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    icon: '📣',
    name: 'Captador de Clientes',
    description: 'Genera campañas de marketing con IA',
    path: '/tools/customer-capture',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    icon: '⚡',
    name: 'Automatizador',
    description: 'Automatiza procesos y flujos',
    path: '/tools/automation',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 4,
    icon: '📈',
    name: 'Analizador de Rentabilidad',
    description: 'Analiza márgenes y proyecciones',
    path: '/tools/profitability',
    color: 'from-orange-500 to-orange-600',
  },
];

export function BusinessDashboard() {
  const { profile } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const metrics = [
    {
      label: 'Ventas del Mes',
      value: '$8,500',
      change: '+12.5%',
      icon: '💵',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Clientes Activos',
      value: '145',
      change: '+8 nuevos',
      icon: '👥',
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Tasa de Conversión',
      value: '3.2%',
      change: '+0.5%',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Margen Promedio',
      value: '42%',
      change: '+2%',
      icon: '📈',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar
        stage="negocio"
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        } pt-16`}
      >
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              Dashboard Negocio
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestión integral para negocios validados (1-3 años)
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Sales Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Ventas del Mes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#10B981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Customers Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Estado de Clientes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {customerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Tus Herramientas
            </h2>
            <ToolsGrid tools={businessTools} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
