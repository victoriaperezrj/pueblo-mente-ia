import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Menu,
  X,
  Check,
  Zap,
  Target,
  TrendingUp,
  Briefcase,
  Sparkles,
  Brain,
  Rocket,
  ChevronRight,
  Star,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImprovedFloatingBot } from "@/components/business-bot/ImprovedFloatingBot";
import { FloatingOrbs } from "@/components/business-bot/FloatingOrbs";
import { FloatingParticles } from "@/components/animations/FloatingParticles";

// ══════════════════════════════════════════════════════════════════════
// LOGIN MODAL - ULTRA PROFESIONAL (COLORES NEUTROS)
// ══════════════════════════════════════════════════════════════════════
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-50 p-4"
      >
        {/* Orbs de fondo - COLORES NEUTROS */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-md w-full"
        >
          {/* Glow externo */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-500/30 to-slate-500/20 
                          rounded-3xl blur-3xl opacity-60" />
          
          {/* Main card */}
          <div className="relative bg-slate-950/95 backdrop-blur-3xl
                          rounded-3xl p-8 shadow-[0_0_100px_rgba(6,182,212,0.3)] overflow-hidden
                          border border-cyan-500/20">
            
            {/* Grid pattern de fondo */}
            <div className="absolute inset-0 opacity-[0.03]"
                 style={{
                   backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
                   backgroundSize: '30px 30px',
                 }} />

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 right-6 z-10 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-lg 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20
                               flex items-center justify-center group-hover:bg-white/20 transition-all">
                  <X className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.button>

            {/* Header */}
            <div className="relative text-center mb-8">
              {/* Icon con rings animados */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 15, 
                  stiffness: 200, 
                  delay: 0.1 
                }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 relative"
              >
                {/* Rings animados */}
                {[0, 0.3, 0.6].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-cyan-500/50"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay
                    }}
                  />
                ))}
                
                {/* Glow rotativo */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #06B6D4, #3B82F6, #06B6D4)',
                    backgroundSize: '200% 200%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Icon container */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600
                               flex items-center justify-center shadow-2xl">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Zap className="w-10 h-10 text-white drop-shadow-2xl" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl font-extrabold mb-3"
              >
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-slate-200 
                               bg-clip-text text-transparent drop-shadow-lg">
                  Ingresá a tu cuenta
                </span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-slate-300 text-base"
              >
                Empezá a usar IA para tu negocio en{' '}
                <span className="font-bold text-cyan-400">2 minutos</span>
              </motion.p>
            </div>

            {/* Buttons - CON COLOR VIBRANTE */}
            <div className="relative space-y-4 mb-6">
              {/* Google button - MÁS COLOR */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  window.location.href = "/auth?mode=login&provider=google";
                }}
                className="w-full group relative overflow-hidden"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 
                               opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-3 px-6 py-4 
                               bg-white rounded-xl font-bold text-gray-900 
                               shadow-2xl group-hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]
                               transition-all duration-300
                               border-2 border-blue-500/20 group-hover:border-blue-400/50">
                  <motion.svg 
                    className="w-6 h-6" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </motion.svg>
                  <span>Continuar con Google</span>
                </div>
              </motion.button>

              {/* Email button - MÁS COLOR */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  window.location.href = "/auth?mode=login";
                }}
                className="w-full group relative overflow-hidden"
              >
                {/* Background con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600" />
                
                {/* Animated shine */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 
                             group-hover:opacity-100"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 
                               opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-3 px-6 py-4 
                               backdrop-blur-xl
                               font-bold text-white
                               shadow-2xl group-hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                               transition-all duration-300">
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Mail className="w-6 h-6" />
                  </motion.div>
                  <span>Continuar con Email</span>
                </div>
              </motion.button>
            </div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-slate-950 text-slate-400 text-sm">
                  ¿Primera vez acá?
                </span>
              </div>
            </motion.div>

            {/* Sign up link - MÁS VIBRANTE */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onClose();
                window.location.href = "/auth?mode=signup";
              }}
              className="w-full py-4 text-center font-bold text-lg relative group overflow-hidden rounded-xl
                         border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-all"
            >
              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, #06B6D4, #3B82F6, #06B6D4)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <span className="relative bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Crear cuenta gratis →
              </span>
            </motion.button>

            {/* Footer text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center text-slate-500 text-xs mt-6"
            >
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                Sin tarjeta. Sin trucos. Solo empezá.
              </span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════
// HERO SECTION CON AMBOS BOTONES ARREGLADOS
// ══════════════════════════════════════════════════════════════════════
function ImprovedAnimatedHero({ onLoginClick }: { onLoginClick: () => void }) {
  const navigate = useNavigate();

  const words = [
    { text: "De la", color: "text-white/90" },
    { text: "idea", color: "text-amber-400" },
    { text: "a los", color: "text-white/90" },
    { text: "números", color: "text-emerald-400" },
  ];

  return (
    <div className="text-center max-w-5xl mx-auto">
      {/* Badge superior */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="inline-block mb-8"
      >
        <div className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 
                        border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
              IA que entiende Argentina
            </span>
          </div>
        </div>
      </motion.div>

      {/* Título animado */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
        {words.map((word, i) => (
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
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-white/80"
        >
          en días, no meses
        </motion.span>
      </h1>

      {/* Subtítulo */}
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
        {[
          { text: 'Sin tarjeta' },
          { text: 'Datos seguros' },
          { text: 'Empezá en 2 min' },
        ].map((feature, i) => (
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
              <Check className="w-4 h-4 text-emerald-400" />
              {feature.text}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* BOTONES PRINCIPALES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        {/* Botón Iniciar Sesión */}
        <motion.button
          onClick={onLoginClick}
          whileHover={{ 
            scale: 1.08,
            boxShadow: '0 25px 70px rgba(59, 130, 246, 0.6)'
          }}
          whileTap={{ scale: 0.96 }}
          className="group relative px-10 py-5 rounded-2xl overflow-hidden font-bold text-white text-lg
                     shadow-2xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-0 
                       group-hover:opacity-100 transition-opacity duration-700"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 blur-xl bg-gradient-to-r from-blue-400 to-cyan-400" />
          <span className="relative z-10 flex items-center gap-3 drop-shadow-lg">
            <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Iniciar Sesión
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        {/* Botón Ver Demo - ARREGLADO */}
        <motion.button
          onClick={() => navigate('/select-role')}
          whileHover={{ 
            scale: 1.08,
            boxShadow: '0 25px 70px rgba(16, 185, 129, 0.6)'
          }}
          whileTap={{ scale: 0.96 }}
          className="group relative px-10 py-5 rounded-2xl overflow-hidden font-bold text-white text-lg
                     shadow-2xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-0 
                       group-hover:opacity-100 transition-opacity duration-700"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 100%' }}
          />
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300 blur-xl bg-gradient-to-r from-emerald-400 to-teal-400" />
          <span className="relative z-10 flex items-center gap-3 drop-shadow-lg">
            <Sparkles className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
            Ver Demo
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// STAGE CARD
// ══════════════════════════════════════════════════════════════════════
interface StageCardProps {
  title: string;
  stageLabel: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  buttonText: string;
  colorScheme: "blue" | "purple" | "green";
  isPopular?: boolean;
  onClick: () => void;
}

function StageCard({
  title,
  stageLabel,
  icon: Icon,
  description,
  features,
  buttonText,
  colorScheme,
  isPopular = false,
  onClick,
}: StageCardProps) {
  const colors = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      hover: "hover:shadow-blue-500/50",
      text: "text-blue-600",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      hover: "hover:shadow-purple-500/50",
      text: "text-purple-600",
    },
    green: {
      bg: "from-green-500 to-green-600",
      hover: "hover:shadow-green-500/50",
      text: "text-green-600",
    },
  };

  const scheme = colors[colorScheme];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl ${scheme.hover} transition-all duration-300 cursor-pointer hover:scale-105 border border-gray-100`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-xs font-bold text-black shadow-lg">
          MÁS USADO
        </div>
      )}

      <div className={`w-16 h-16 bg-gradient-to-br ${scheme.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      <div className="mb-2">
        <span className={`text-xs font-bold ${scheme.text} uppercase tracking-wider`}>
          {stageLabel}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>

      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-xl bg-gradient-to-r ${scheme.bg} text-white font-semibold shadow-md group-hover:shadow-lg transition-all hover:scale-105`}
      >
        {buttonText} →
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════════════════
export default function Index() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <FloatingOrbs />
      <FloatingParticles count={30} />
      <ImprovedFloatingBot />

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      <div className="min-h-screen">
        {/* NAVIGATION */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Proyecto Emprendedurismo</span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => navigate("/select-role")}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Ver Demo
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md hover:scale-105"
                >
                  Iniciar Sesión
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3 animate-fade-in">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/select-role");
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Ver Demo
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLoginModal(true);
                  }}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-center"
                >
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-[100px] animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[100px] animate-float-slower"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-500/25 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }}></div>

          <div className="container mx-auto px-6 relative z-10">
            <ImprovedAnimatedHero onLoginClick={() => setShowLoginModal(true)} />
          </div>
        </section>

        {/* SECCIÓN DE ETAPAS */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm mb-4">
                <Target className="w-4 h-4" />
                Tu camino al éxito
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                ¿En qué{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  etapa
                </span>{" "}
                estás?
              </h2>
              <p className="text-lg text-gray-600">
                Elegí tu ruta y accedé a herramientas diseñadas específicamente para ti
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <StageCard
                title="Emprendedor"
                stageLabel="DESDE CERO"
                icon={Zap}
                description="¿Tenés una idea pero no sabés si funciona?"
                features={["Validá con IA en minutos", "Ves números reales", "Entendé viabilidad"]}
                buttonText="Validar idea"
                colorScheme="blue"
                onClick={() => navigate("/select-role")}
              />

              <StageCard
                title="Negocio"
                stageLabel="1-3 AÑOS"
                icon={TrendingUp}
                description="Vendés, pero todo a mano. Necesitás ordenar y crecer."
                features={["Dashboard real-time", "CRM + Ventas + Gastos", "Control sin planillas"]}
                buttonText="Organizar negocio"
                colorScheme="purple"
                isPopular={true}
                onClick={() => navigate("/select-role")}
              />

              <StageCard
                title="Empresa"
                stageLabel="+3 AÑOS"
                icon={Briefcase}
                description="Tu empresa creció. Automatizá y escalá con IA."
                features={["Multi-sucursal", "Gestión de equipo", "Automatización con IA"]}
                buttonText="Automatizar empresa"
                colorScheme="green"
                onClick={() => navigate("/select-role")}
              />
            </div>

            <div className="text-center mt-16 animate-fade-in">
              <p className="text-gray-600 mb-4">¿No estás seguro de tu etapa?</p>
              <Button
                variant="outline"
                size="lg"
                className="hover:scale-105 transition-transform"
                onClick={() => navigate("/business-ai-bot")}
              >
                <Brain className="w-5 h-5 mr-2" />
                Dejá que la IA te ayude a elegir
              </Button>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-8 font-semibold">
                Confiado por emprendedores argentinos
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">+1,000 usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
