// src/components/dashboard/MetricCard.tsx
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export function MetricCard({ label, value, change, icon, color }: MetricCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        {isPositive ? (
          <TrendingUp className="w-5 h-5 text-green-300" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-300" />
        )}
      </div>
      <p className="text-white/80 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-black mb-2">{value}</p>
      <p className={`text-sm font-semibold ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
        {change}
      </p>
    </motion.div>
  );
}
