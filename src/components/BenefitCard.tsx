import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge: string;
  colorFrom: string;
  colorTo: string;
  delay?: number;
}

export const BenefitCard = ({ 
  icon: Icon, 
  title, 
  description, 
  badge,
  colorFrom, 
  colorTo,
  delay = 0
}: BenefitCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateY((x - centerX) / 20);
    setRotateX((centerY - y) / 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.3)'
      }}
      className={`group relative bg-gradient-to-br ${colorFrom} ${colorTo} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 cursor-pointer benefit-card`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className={`w-16 h-16 bg-gradient-to-br ${colorFrom.replace('from-', 'from-').replace('-50', '-500')} ${colorTo.replace('to-', 'to-').replace('-50', '-600')} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <Check className="w-5 h-5" />
          {badge}
        </div>
      </div>
    </motion.div>
  );
};
