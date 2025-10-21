import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";

const FloatingBot = () => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 pointer-events-none"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      }}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Bot container */}
        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-3xl shadow-2xl">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <MessageCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          {/* Sparkles */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </motion.div>
        </div>
        
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-400"
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.8, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FloatingBot;
