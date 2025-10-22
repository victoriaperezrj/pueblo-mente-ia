// ============================================
// ✨ ANIMATED BACKGROUND - PROYECTO EMPRENDEDURISMO
// ============================================
// Background elegante con orbs flotantes y partículas
// Compatible con Lovable (React + Framer Motion)
// ============================================

import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient - Azul marino a negro profundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950" />
      
      {/* Gradient orbs sutiles y elegantes */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)",
          top: "50%",
          right: "5%",
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)",
          bottom: "10%",
          left: "45%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -70, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
      
      <motion.div
        className="absolute w-[380px] h-[380px] rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          top: "30%",
          left: "60%",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />
      
      {/* Grid sutil de fondo */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Partículas flotantes elegantes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
