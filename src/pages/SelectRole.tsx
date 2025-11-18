import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  Building2,
  Globe,
  ChevronLeft,
  ArrowRight,
  UserPlus,
  LogIn,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SelectRole() {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const stages = [
    {
      id: 'emprendedor',
      title: 'Emprendedor',
      subtitle: '0-1 año',
      description: 'Tenés una idea con potencial',
      icon: Lightbulb,
      gradient: 'from-blue-500 to-blue-600',
      features: ['Validación de mercado', 'MVP rápido', 'Primeros clientes'],
      route: '/entrepreneur/dashboard',
      buttonText: 'Empezar como Emprendedor',
      popular: false,
      badge: 'IDEAL PARA INICIAR'
    },
    {
      id: 'negocio',
      title: 'Negocio',
      subtitle: '1-3 años',
      description: 'Tu negocio está validado y creciendo',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      features: ['Escalar ventas', 'Optimizar operaciones', 'Crecer equipo'],
      route: '/business/dashboard',
      buttonText: 'Empezar como Negocio',
      popular: true,
      badge: 'MÁS ELEGIDO'
    },
    {
      id: 'empresa',
      title: 'Empresa',
      subtitle: '3-10 años',
      description: 'Empresa PYME establecida',
      icon: Building2,
      gradient: 'from-green-500 to-green-600',
      features: ['Multi-sucursal', 'Analytics avanzado', 'Automatización'],
      route: '/pyme/dashboard',
      buttonText: 'Empezar como Empresa',
      popular: false,
      badge: 'CRECIMIENTO'
    },
    {
      id: 'global',
      title: 'Global',
      subtitle: '10+ años',
      description: 'Empresa multinacional',
      icon: Globe,
      gradient: 'from-violet-500 to-violet-600',
      features: ['Multi-región', 'BI avanzado', 'Expansión global'],
      route: '/dashboard/global',
      buttonText: 'Empezar como Global',
      popular: false,
      badge: 'ENTERPRISE'
    }
  ];

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    const stage = stages.find(s => s.id === selectedStage);
    if (stage) {
      // Store selected stage for after signup
      localStorage.setItem('selectedStage', selectedStage || '');
      localStorage.setItem('selectedStageRoute', stage.route);
      navigate('/auth/signup');
    }
  };

  const handleLogin = () => {
    const stage = stages.find(s => s.id === selectedStage);
    if (stage) {
      // Store selected stage for after login
      localStorage.setItem('selectedStage', selectedStage || '');
      localStorage.setItem('selectedStageRoute', stage.route);
      navigate('/auth?mode=login');
    }
  };

  const handleDemoMode = () => {
    const stage = stages.find(s => s.id === selectedStage);
    if (stage) {
      // Enable demo/testing mode and go directly to dashboard
      localStorage.setItem('testingMode', 'true');
      localStorage.setItem('currentStage', selectedStage || '');
      navigate(stage.route);
    }
  };

  const selectedStageData = stages.find(s => s.id === selectedStage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            ¿En qué <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">etapa</span> estás?
          </h1>
          <p className="text-white/80 text-xl">
            Elegí tu ruta y explorá las herramientas personalizadas
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleStageSelect(stage.id)}
                className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 cursor-pointer hover:bg-white/10 transition-all"
              >
                {stage.popular && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-black text-xs font-bold">
                    {stage.badge}
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-br ${stage.gradient} rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform shadow-xl`}>
                  <Icon className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{stage.title}</h3>
                <p className="text-white/60 text-sm mb-3">{stage.subtitle}</p>
                <p className="text-white/80 text-sm mb-4">{stage.description}</p>

                <div className="space-y-1.5 mb-4">
                  {stage.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/70 text-xs">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 bg-gradient-to-r ${stage.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm`}
                >
                  Seleccionar
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && selectedStageData && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                {/* Close button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Stage info */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedStageData.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                    <selectedStageData.icon className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Modo {selectedStageData.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedStageData.description}
                  </p>
                </div>

                {/* Auth options */}
                <div className="space-y-3">
                  {/* Primary: Sign up */}
                  <Button
                    onClick={handleSignup}
                    className={`w-full py-6 bg-gradient-to-r ${selectedStageData.gradient} hover:opacity-90 text-white font-semibold rounded-xl shadow-lg text-lg`}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Crear cuenta nueva
                  </Button>

                  {/* Secondary: Login */}
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="w-full py-6 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl text-lg"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar sesión
                  </Button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white text-gray-500">o</span>
                    </div>
                  </div>

                  {/* Demo mode */}
                  <button
                    onClick={handleDemoMode}
                    className="w-full py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Explorar sin cuenta (modo demo)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <p className="text-xs text-center text-gray-400 mt-4">
                  Podés cambiar de etapa en cualquier momento desde Configuración
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
