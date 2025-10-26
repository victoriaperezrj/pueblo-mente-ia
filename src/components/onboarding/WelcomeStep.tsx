import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center text-white max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8"
      >
        <Rocket className="w-12 h-12 text-[hsl(var(--primary))]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-6xl font-bold mb-6"
      >
        ¡Bienvenido! 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xl md:text-2xl mb-12 text-white/90"
      >
        En 2 minutos voy a entender tu situación y armarte un plan personalizado
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-white text-[hsl(var(--primary))] hover:bg-white/90 text-lg px-12 py-6 h-auto"
        >
          Empezar ahora
        </Button>
      </motion.div>
    </motion.div>
  );
}
