// ══════════════════════════════════════════════════════════════════════
// 🎯 SELECT ROLE - REDISEÑADO PREMIUM
// ══════════════════════════════════════════════════════════════════════
// Reemplazá COMPLETO tu archivo src/pages/SelectRole.tsx con esto

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Building2, Check, ArrowRight, Sparkles, ChevronLeft } from "lucide-react";

export default function SelectRole() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const stages = [
    {
      id: 'emprendedor',
      title: 'Emprendedor',
      subtitle: 'DESDE CERO',
      description: 'Tenés una idea pero no sabés si funciona?',
      icon: Zap,
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      glowColor: 'rgba(59, 130, 246, 0.6)',
      features: [
        'Validá con IA',
        'Ves números reales',
        'Entendé viabilidad'
      ],
      route: '/demo/idea-capture',
      buttonText: 'Validar Idea →'
    },
    {
      id: 'negocio',
      title: 'Negocio',
      subtitle: '1-3 AÑOS',
      description: 'Vendés, pero todo a mano. Necesitás ordenar y crecer.',
      icon: TrendingUp,
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      features: [
        'Dashboard real-time',
        'CRM simple',
        'Control gastos'
      ],
      route: '/demo/business-dashboard',
      buttonText: 'Organizar Negocio →',
      popular: true
    },
    {
      id: 'empresa',
      title: 'Empresa',
      subtitle: '+3 AÑOS',
      description: 'Creció tu empresa. Automatizá y escalá con IA.',
      icon: Building2,
      gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
      glowColor: 'rgba(16, 185, 129, 0.6)',
      features: [
        'Gestión de equipo',
        'Automatización',
        'Multi-sucursal'
      ],
      route: '/demo/company-dashboard',
      buttonText: 'Automatizar Empresa →'
    }
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver al inicio
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                            border border-white/10 backdrop-blur-xl">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Tu camino al éxito
              </span>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            ¿En qué{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              etapa
            </span>{" "}
            estás?
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -12, scale: 1.02 }}
              onHoverStart={() => setHoveredCard(stage.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => handleNavigate(stage.route)}
              className="relative group cursor-pointer"
            >
              {/* Popular badge */}
              {stage.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 
                                  text-xs font-bold text-white shadow-xl flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Más Popular
                  </div>
                </motion.div>
              )}

              {/* Card */}
              <div className={`relative h-full p-8 rounded-3xl backdrop-blur-2xl 
                              bg-slate-900/40 hover:bg-slate-900/60
                              border transition-all duration-500
                              ${hoveredCard === stage.id ? 'border-white/30' : 'border-white/10'}
                              ${stage.popular ? 'ring-2 ring-amber-500/30' : ''}`}>
                
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 
                             transition-opacity duration-500 blur-2xl -z-10`}
                  style={{ background: `linear-gradient(135deg, ${stage.glowColor}, transparent)` }}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${stage.gradient} 
                            p-0.5 mb-6 shadow-2xl`}
                >
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                    <stage.icon className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                {/* Subtitle badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4
                                bg-gradient-to-r ${stage.gradient} text-white`}>
                  {stage.subtitle}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-white mb-4">
                  {stage.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 mb-6 leading-relaxed text-base">
                  {stage.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {stage.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.15 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-white/80"
                    >
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${stage.gradient} 
                                    flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-white
                            bg-gradient-to-r ${stage.gradient}
                            shadow-xl hover:shadow-2xl
                            transition-all duration-300 
                            flex items-center justify-center gap-2 group/btn`}
                >
                  {stage.buttonText}
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-white/60 mb-4">¿No estás seguro de tu etapa?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/business-ai-bot')}
            className="px-8 py-4 rounded-xl bg-white/[0.08] backdrop-blur-xl border border-white/20
                       font-semibold text-white hover:bg-white/[0.12] hover:border-white/30
                       transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            Dejá que la IA te ayude a elegir
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
