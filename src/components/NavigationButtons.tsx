// ============================================
// 🧭 NAVIGATION - PROYECTO EMPRENDEDURISMO
// ============================================
// Header con blur effect y floating chat button
// Compatible con Lovable (React + Framer Motion)
// ============================================

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const Navigation = () => {
  return (
    <>
      {/* Header fijo con blur */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/80 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo con gradiente */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 
                          flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              Proyecto Emprendedurismo
            </span>
          </motion.div>
          
          {/* Navegación desktop */}
          <nav className="hidden md:flex gap-8 text-sm font-medium text-white/70">
            <motion.a
              href="#demo"
              whileHover={{ color: 'rgba(255, 255, 255, 1)' }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Ver Demo
            </motion.a>
            <motion.a
              href="#precios"
              whileHover={{ color: 'rgba(255, 255, 255, 1)' }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Precios
            </motion.a>
            <motion.a
              href="#contacto"
              whileHover={{ color: 'rgba(255, 255, 255, 1)' }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contacto
            </motion.a>
          </nav>
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600
                       font-semibold text-white text-sm shadow-lg hover:shadow-xl
                       transition-all duration-300"
          >
            Iniciar Sesión
          </motion.button>
        </div>
      </motion.header>
      
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full 
                   bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600
                   shadow-2xl hover:shadow-blue-500/50 transition-all duration-300
                   flex items-center justify-center text-white group"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        
        {/* Pulse ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.button>
    </>
  );
};

export default Navigation;
