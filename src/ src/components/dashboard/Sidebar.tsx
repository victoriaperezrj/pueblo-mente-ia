// src/components/dashboard/Sidebar.tsx
import { motion } from 'framer-motion';
import { Menu, X, LogOut, Settings, LayoutDashboard, DollarSign, Package, Users, BarChart, Zap, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  stage: 'emprendedor' | 'negocio' | 'pyme';
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ stage, open, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const stageConfig = {
    emprendedor: {
      icon: '💡',
      name: 'Emprendedor',
      color: 'from-blue-500 to-blue-600',
    },
    negocio: {
      icon: '🏪',
      name: 'Negocio',
      color: 'from-green-500 to-green-600',
    },
    pyme: {
      icon: '🏢',
      name: 'PyME',
      color: 'from-purple-500 to-purple-600',
    },
  };

  const config = stageConfig[stage];

  const menuItems = [
    { label: 'Inicio', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Ventas', icon: DollarSign, path: '/sales' },
    { label: 'Productos', icon: Package, path: '/products' },
    { label: 'Clientes', icon: Users, path: '/customers' },
    { label: 'Gastos', icon: BarChart, path: '/expenses' },
    { label: 'Automatizaciones', icon: Zap, path: '/automations' },
    { label: 'Aprender', icon: BookOpen, path: '/learn' },
  ];

  return (
    <motion.aside
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg z-30`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between h-16">
        <motion.div
          animate={{ opacity: open ? 1 : 0 }}
          className={`flex items-center gap-3 ${open ? '' : 'hidden'}`}
        >
          <div className={`text-2xl bg-gradient-to-br ${config.color} rounded-lg p-2`}>
            {config.icon}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {config.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Dashboard</p>
          </div>
        </motion.div>
        <button 
          onClick={onToggle} 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
              whileHover={{ x: open ? 5 : 0 }}
            >
              <Icon className="w-5 h-5" />
              <motion.span
                animate={{ opacity: open ? 1 : 0 }}
                className={`font-medium ${open ? '' : 'hidden'}`}
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white">
          <Settings className="w-5 h-5" />
          <motion.span
            animate={{ opacity: open ? 1 : 0 }}
            className={`font-medium text-sm ${open ? '' : 'hidden'}`}
          >
            Configuración
          </motion.span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-red-600 dark:text-red-400">
          <LogOut className="w-5 h-5" />
          <motion.span
            animate={{ opacity: open ? 1 : 0 }}
            className={`font-medium text-sm ${open ? '' : 'hidden'}`}
          >
            Salir
          </motion.span>
        </button>
      </div>
    </motion.aside>
  );
}
