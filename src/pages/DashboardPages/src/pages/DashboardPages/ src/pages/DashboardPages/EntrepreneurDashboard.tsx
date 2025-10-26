// src/pages/DashboardPages/EntrepreneurDashboard.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ToolsGrid } from '@/components/dashboard/ToolsGrid';
// import { useUser } from '@/hooks/useUser'; // Asumiendo que useUser existe y funciona

// Mock de useUser para evitar errores de compilación si no existe
const useUser = () => ({
  profile: { full_name: 'Usuario' }
});

export function EntrepreneurDashboard() {
  const { profile } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Herramientas de IA para el emprendedor
  const entrepreneurTools = [
    {
      id: 1,
      icon: '💡',
      name: 'Validador de Ideas',
      description: 'Valida tu idea con análisis de IA',
      path: '/tools/idea-validator',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      icon: '🎯',
      name: 'Análisis de Mercado',
      description: 'Descubre tu mercado objetivo',
      path: '/tools/market-analysis',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 3,
      icon: '💰',
      name: 'Calculadora de Presupuesto',
      description: 'Planifica tu inversión inicial',
      path: '/tools/budget-calculator',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      icon: '📋',
      name: 'Plan de Negocio',
      description: 'Genera tu plan en minutos',
      path: '/tools/business-plan',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  // Métricas de negocio (mockeado para fase inicial)
  const metrics = [
    {
      label: 'Ventas del Mes',
      value: '$0',
      change: '+0%',
      icon: '💵',
      color: 'from-gray-400 to-gray-500', // Color neutro para indicar inicio
    },
    {
      label: 'Productos',
      value: '0',
      change: '0 registrados',
      icon: '📦',
      color: 'from-gray-400 to-gray-500',
    },
    {
      label: 'Clientes',
      value: '0',
      change: '0 activos',
      icon: '👥',
      color: 'from-gray-400 to-gray-500',
    },
    {
      label: 'Turnos Hoy',
      value: '0',
      change: '0 pendientes',
      icon: '📅',
      color: 'from-gray-400 to-gray-500',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar
        stage="emprendedor"
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        } pt-16`} // pt-16 para dejar espacio al navbar si existe
      >
        <div className="p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              ¡Bienvenido de nuevo, {profile?.full_name || 'Emprendedor'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Aquí está el resumen de tu negocio y tus herramientas clave.
            </p>
          </motion.div>

          {/* Métricas de Negocio (Integración de funcionalidades anteriores) */}
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

          {/* Tools Grid (Foco en IA y Validación) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Herramientas de Validación y Planificación
            </h2>
            <ToolsGrid tools={entrepreneurTools} />
          </motion.div>

        </div>
      </main>
    </div>
  );
}
