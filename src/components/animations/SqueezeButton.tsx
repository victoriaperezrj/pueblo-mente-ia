import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SqueezeButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SqueezeButton = ({ children, onClick, className = '' }: SqueezeButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full font-semibold text-lg shadow-lg ${className}`}
    >
      <motion.span
        initial={{ display: 'inline-block' }}
        whileHover={{
          scale: [1, 1.1, 0.9, 1.05, 1],
        }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};
