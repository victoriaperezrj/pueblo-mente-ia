// ============================================
// 🚀 HERO SECTION - PROYECTO EMPRENDEDURISMO
// ============================================
// Hero elegante con animaciones fluidas
// Compatible con Lovable (React + Framer Motion)
// ============================================

import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Rocket } from 'lucide-react';

const HeroSection = () => {
  const titleWords = [
    { text: "De la", color: "text-white/90" },
    { text: "idea", color: "text-amber-400" },
    { text: "a los", color: "text-white/90" },
    { text: "números", color: "text-emerald-400" },
  ];
  
  const features = [
    { text: 'Sin tarjeta', icon: CheckCircle2 },
    { text: 'Datos seguros', icon: CheckCircle2 },
    { text: 'Empezá en 2 min', icon: CheckCircle2 },
  ];
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge superior con efecto glow */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="inline-block mb-8"
        >
          <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 
                          border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
                IA que entiende Argentina
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Título animado palabra por palabra */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: i * 0.15, 
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }}
              className={`${word.color} inline-block mx-2`}
              style={{
                textShadow: word.color.includes('amber') || word.color.includes('emerald')
                  ? '0 0 40px currentColor'
                  : 'none'
              }}
            >
              {word.text}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/80"
          >
            en días, no meses
          </motion.span>
        </h1>
        
        {/* Subtítulo elegante */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          La plataforma que combina{' '}
          <span className="text-blue-400 font-semibold">IA</span>
          {' + '}
          <span className="text-amber-400 font-semibold">automatización</span>
          {' + '}
          <span className="text-emerald-400 font-semibold">datos</span>
          {' '}para que emprendedores y PyMEs{' '}
          <span className="text-white/90 font-semibold">validen, organicen y escalen</span>
        </motion.p>
        
        {/* Features rápidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -3 }}
              className="px-5 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-sm border border-white/10
                         hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <feature.icon className="w-4 h-4 text-emerald-400" />
                {feature.text}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTAs principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* CTA Primario con efecto glow */}
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 50px rgba(59, 130, 246, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 rounded-xl overflow-hidden font-bold text-white text-lg
                       shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {/* Gradiente base */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
            
            {/* Efecto hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 
                         group-hover:opacity-100 transition-opacity duration-500"
            />
            
            {/* Contenido */}
            <span className="relative z-10 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Iniciar Sesión
            </span>
          </motion.button>
          
          {/* CTA Secundario */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/20
                       font-bold text-white text-lg hover:bg-white/[0.1] hover:border-white/30
                       transition-all duration-300"
          >
            🚀 Ver Demo
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
