import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ImprovedFloatingBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleOptionClick = (option: string) => {
    switch(option) {
      case 'Validar idea':
        navigate('/select-role');
        break;
      case 'Análisis financiero':
        navigate('/select-role');
        break;
      case 'Plan de negocios':
        navigate('/select-role');
        break;
      default:
        navigate('/select-role');
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón del bot con BREATHING ANIMATION MÁS NOTORIA */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: [1, 1.08, 1],
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ 
          scale: 1.15, 
          rotate: 10,
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer"
        style={{
          boxShadow: isOpen 
            ? "0 20px 80px -12px rgba(139, 92, 246, 0.8)" 
            : "0 20px 60px -12px rgba(139, 92, 246, 0.5)"
        }}
      >
        {/* Animación de "breathing" MEJORADA */}
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-400"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <MessageCircle className="w-8 h-8 text-white relative z-10" />
      </motion.button>

      {/* Chat expandido */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-28 right-8 w-96 h-[500px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl z-50 overflow-hidden border border-purple-200"
          >
            {/* Header del chat */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold">Asistente IA</h3>
                  <p className="text-white/70 text-xs">En línea</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            {/* Área de mensajes */}
            <div className="p-4 h-[360px] overflow-y-auto bg-gradient-to-b from-purple-50/50 to-white/50">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm mb-3"
              >
                <p className="text-gray-700 text-sm">
                  👋 ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                </p>
              </motion.div>
              
              <div className="flex gap-2 flex-wrap">
                {['Validar idea', 'Análisis financiero', 'Plan de negocios'].map((option, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleOptionClick(option)}
                    className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium transition cursor-pointer"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input área */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      // Aquí iría la lógica de envío
                      setMessage('');
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
