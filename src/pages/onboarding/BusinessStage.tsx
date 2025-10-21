import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Rocket, TrendingUp, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomToast } from '@/hooks/use-custom-toast';

type BusinessStage = 'idea' | 'validation' | 'launch' | 'growth' | 'scale';

interface StageOption {
  id: BusinessStage;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const stages: StageOption[] = [
  {
    id: 'idea',
    title: 'Tengo una idea',
    description: 'Estoy explorando posibilidades y necesito validar mi concepto',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'validation',
    title: 'Estoy validando',
    description: 'Ya tengo una idea clara y estoy probando con clientes potenciales',
    icon: Target,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'launch',
    title: 'Estoy lanzando',
    description: 'Tengo mi producto/servicio listo y estoy comenzando a vender',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'growth',
    title: 'Estoy creciendo',
    description: 'Ya tengo clientes y quiero escalar mis operaciones',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'scale',
    title: 'Quiero escalar',
    description: 'Mi negocio está estable y busco expansión estratégica',
    icon: Zap,
    color: 'from-red-500 to-rose-500'
  }
];

export default function BusinessStage() {
  const [selectedStage, setSelectedStage] = useState<BusinessStage | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useCustomToast();

  const handleSubmit = async () => {
    if (!selectedStage) return;
    
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Actualizar perfil con la etapa del negocio
      const { error } = await supabase
        .from('profiles')
        .update({ 
          user_type: 'entrepreneur', // Asumimos entrepreneur por defecto
          // Aquí podrías agregar un campo business_stage si existe en tu schema
        })
        .eq('id', user.id);

      if (error) throw error;

      showToast('¡Perfil completado! Redirigiendo...', 'success');
      
      // Redirigir al ecosistema/dashboard apropiado
      setTimeout(() => {
        navigate('/entrepreneur/dashboard');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error guardando etapa:', error);
      showToast(error.message || 'Error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      {ToastComponent}
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
            top: "20%",
            left: "10%",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            ¿En qué etapa está tu negocio?
          </h1>
          <p className="text-lg text-gray-600">
            Esto nos ayuda a personalizar la experiencia para vos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stages.map((stage, index) => (
            <motion.button
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStage(stage.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${selectedStage === stage.id
                  ? 'border-purple-500 bg-white shadow-xl scale-105'
                  : 'border-gray-200 bg-white/80 hover:border-purple-300 hover:shadow-lg'
                }
              `}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedStage === stage.id && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10"
                  layoutId="selected-bg"
                />
              )}
              
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center mb-4 mx-auto`}>
                  <stage.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {stage.title}
                </h3>
                
                <p className="text-sm text-gray-600">
                  {stage.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleSubmit}
            disabled={!selectedStage || loading}
            className={`
              px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300
              ${selectedStage && !loading
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {loading ? 'Guardando...' : 'Continuar'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
