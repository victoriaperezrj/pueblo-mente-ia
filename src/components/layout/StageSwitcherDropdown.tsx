import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, Building2, ChevronDown, Check } from 'lucide-react';

export function StageSwitcherDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect current stage from path
  const getCurrentStage = () => {
    if (location.pathname.includes('emprendedor') || location.pathname.includes('entrepreneur')) {
      return 'emprendedor';
    }
    if (location.pathname.includes('negocio') || location.pathname.includes('business')) {
      return 'negocio';
    }
    if (location.pathname.includes('empresa') || location.pathname.includes('pyme')) {
      return 'empresa';
    }
    return 'emprendedor';
  };

  const currentStage = getCurrentStage();

  const stages = [
    { 
      id: 'emprendedor', 
      icon: Lightbulb, 
      label: 'Emprendedor', 
      subtitle: '0-1 año', 
      route: '/entrepreneur/dashboard',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'negocio', 
      icon: TrendingUp, 
      label: 'Negocio', 
      subtitle: '1-3 años', 
      route: '/business/dashboard',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'empresa', 
      icon: Building2, 
      label: 'Empresa', 
      subtitle: '3+ años', 
      route: '/pyme/dashboard',
      color: 'from-green-500 to-green-600'
    }
  ];

  const currentStageData = stages.find(s => s.id === currentStage) || stages[0];
  const CurrentIcon = currentStageData.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
      >
        <CurrentIcon className="w-5 h-5" />
        <span className="font-semibold">{currentStageData.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
            >
              {stages.map((stage) => {
                const StageIcon = stage.icon;
                const isActive = currentStage === stage.id;
                
                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      navigate(stage.route);
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      isActive ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? `bg-gradient-to-br ${stage.color} text-white` : 'bg-gray-100 text-gray-600'
                    }`}>
                      <StageIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{stage.label}</p>
                      <p className="text-xs text-gray-500">{stage.subtitle}</p>
                    </div>
                    {isActive && (
                      <Check className="w-5 h-5 text-blue-500" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
