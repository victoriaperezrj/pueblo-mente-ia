import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Calculator,
  Grid3x3,
  Rocket,
  Target,
  TrendingUp,
  Users,
  Clock,
  Menu,
  X,
  Home,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

// Componente Sidebar
const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: 'Dashboard', route: '/entrepreneur/dashboard' },
    { icon: Lightbulb, label: 'Validador de Ideas', route: '/entrepreneur/idea-validator' },
    { icon: Calculator, label: 'Simulador Financiero', route: '/entrepreneur/financial-simulator' },
    { icon: Grid3x3, label: 'Lean Canvas', route: '/entrepreneur/lean-canvas' },
  ];

  return (
    <>
      {/* Backdrop mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 z-50 lg:translate-x-0 lg:static"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Emprendedor</h3>
                  <p className="text-xs text-gray-500">0-1 año</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.route}
                onClick={() => {
                  navigate(item.route);
                  setIsOpen(false);
                }}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Configuración</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Ayuda</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Componente StatCard
const StatCard = ({ icon: Icon, label, value, trend, color }: any) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)' }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </motion.div>
  );
};

// Componente ToolCard
const ToolCard = ({ icon: Icon, title, description, color, route }: any) => {
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => navigate(route)}
      whileHover={{ y: -8, boxShadow: '0 30px 60px -15px rgba(0,0,0,0.2)' }}
      whileTap={{ scale: 0.98 }}
      className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 cursor-pointer"
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
        Empezar
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </motion.div>
  );
};

// Dashboard principal
export default function EntrepreneurDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const stats = [
    { icon: Target, label: 'Validación completada', value: '65%', trend: '+12%', color: 'from-blue-500 to-blue-600' },
    { icon: TrendingUp, label: 'Ideas validadas', value: '3', trend: '+1', color: 'from-green-500 to-green-600' },
    { icon: Users, label: 'Simulaciones', value: '12', trend: '+4', color: 'from-purple-500 to-purple-600' },
    { icon: Clock, label: 'Días desde inicio', value: '23', color: 'from-orange-500 to-orange-600' },
  ];

  const tools = [
    {
      icon: Lightbulb,
      title: 'Validador de Ideas IA',
      description: 'Modo Shark Tank: IA te hace preguntas difíciles para validar tu idea',
      color: 'from-yellow-500 to-orange-500',
      route: '/entrepreneur/idea-validator',
    },
    {
      icon: Calculator,
      title: 'Simulador Financiero',
      description: 'Proyecciones en tiempo real con sliders interactivos',
      color: 'from-green-500 to-emerald-600',
      route: '/entrepreneur/financial-simulator',
    },
    {
      icon: Grid3x3,
      title: 'Lean Canvas IA',
      description: 'Canvas pre-llenado con sugerencias inteligentes de IA',
      color: 'from-purple-500 to-purple-600',
      route: '/entrepreneur/lean-canvas',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Bienvenido de vuelta 👋</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>

          {/* Tools section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tus herramientas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <ToolCard {...tool} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-2">¿Primera vez acá?</h3>
            <p className="text-white/90 mb-6">
              Empezá validando tu idea con nuestro asistente IA. Te tomará solo 5 minutos.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/entrepreneur/idea-validator')}
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Validar mi idea →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
