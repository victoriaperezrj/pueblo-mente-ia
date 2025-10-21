import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface AnimatedCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  gradient: string;
  delay: number;
  onClick: () => void;
  badge?: ReactNode;
}

const AnimatedCard = ({
  icon: Icon,
  title,
  subtitle,
  description,
  features,
  gradient,
  delay,
  onClick,
  badge,
}: AnimatedCardProps) => {
  return (
    <motion.div
      className="clay-card-grok group cursor-pointer noise-texture relative"
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.7,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -20,
        scale: 1.03,
        rotateX: 5,
        rotateY: 3,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {badge}
      
      <div className="relative">
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-75 blur-xl transition duration-700"
          style={{
            background: `linear-gradient(to right, ${gradient.replace("from-", "").replace("to-", ", ")})`,
          }}
        />
        
        <div className={`relative bg-gradient-to-br ${gradient} p-10 rounded-3xl text-white shadow-2xl`}>
          {/* Icon with animation */}
          <motion.div
            className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 mx-auto"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-10 h-10" />
          </motion.div>
          
          {/* Content */}
          <motion.h2
            className="text-3xl font-extrabold text-center mb-3 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {title}
          </motion.h2>
          
          <p className="text-center font-semibold mb-5 text-lg opacity-90">{subtitle}</p>
          <p className="text-center text-white/95 mb-8 leading-relaxed text-base">{description}</p>
          
          {/* Features */}
          <div className="text-sm space-y-3 opacity-95 mb-6">
            {features.map((feature, idx) => (
              <motion.p
                key={idx}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 + idx * 0.1 }}
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {feature}
              </motion.p>
            ))}
          </div>
          
          {/* CTA */}
          <motion.div
            className="mt-8 text-center"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 text-base font-bold">
              Empezar <span className="text-xl">→</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnimatedCard;
