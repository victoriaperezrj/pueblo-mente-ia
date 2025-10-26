import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onDemoClick: () => void;
  onStartClick: () => void;
}

export const HeroSection = ({ onDemoClick, onStartClick }: HeroSectionProps) => {
  const floatingAnimation = {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity as number,
      ease: "easeInOut" as const
    }
  };

  const stats = [
    { value: 1250, label: "Emprendedores", icon: Users },
    { value: 89, label: "Tasa de Éxito", suffix: "%", icon: Target },
    { value: 450, label: "Negocios Lanzados", icon: TrendingUp },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-entrepreneur/80 dark:from-primary/80 dark:via-accent/60 dark:to-entrepreneur/60" />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-success/30 rounded-full blur-3xl"
        animate={floatingAnimation}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-business/30 rounded-full blur-3xl"
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
      />
      <motion.div
        className="absolute top-40 right-20 w-64 h-64 bg-pyme/30 rounded-full blur-3xl"
        animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 4 } }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full mb-6 border border-white/30"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">Potenciado con IA</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Tu{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Viaje Emprendedor
            </span>
            {' '}Empieza Acá
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Herramientas impulsadas por IA para validar ideas, planificar negocios y escalar tu empresa en Argentina 🇦🇷
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={onStartClick}
              className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6"
            >
              Empezar Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onDemoClick}
              className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 backdrop-blur-lg text-lg px-8 py-6"
            >
              Ver Demo
            </Button>
          </div>

          {/* Animated Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className="w-8 h-8 text-white mx-auto mb-3" />
                <motion.div
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                >
                  {stat.value}{stat.suffix || '+'}
                </motion.div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
