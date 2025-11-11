import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Building2, ChevronLeft, ArrowRight } from "lucide-react";

export default function SelectRole() {
  const navigate = useNavigate();

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
      badge: 'MÁS ELEGIDO'
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
      subtitle: '3+ años',
      description: 'Empresa PYME o grande',
      icon: Building2,
      gradient: 'from-green-500 to-green-600',
      features: ['Multi-sucursal', 'Analytics avanzado', 'Automatización'],
      route: '/pyme/dashboard',
      buttonText: 'Empezar como Empresa',
      popular: false,
      badge: 'MÁS ELEGIDO'
    }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => navigate(stage.route)}
                className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 cursor-pointer hover:bg-white/10 transition-all"
              >
                {stage.popular && (
                  <div className="absolute -top-4 right-4 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-black text-xs font-bold">
                    {stage.badge}
                  </div>
                )}

                <div className={`w-24 h-24 bg-gradient-to-br ${stage.gradient} rounded-3xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform shadow-2xl`}>
                  <Icon className="w-12 h-12" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-2">{stage.title}</h3>
                <p className="text-white/60 text-sm mb-4">{stage.subtitle}</p>
                <p className="text-white/80 mb-6">{stage.description}</p>

                <div className="space-y-2 mb-6">
                  {stage.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 bg-gradient-to-r ${stage.gradient} text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2`}
                >
                  {stage.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
