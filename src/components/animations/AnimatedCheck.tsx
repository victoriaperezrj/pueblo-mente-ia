import { motion } from 'framer-motion';

interface AnimatedCheckProps {
  delay?: number;
}

export const AnimatedCheck = ({ delay = 0 }: AnimatedCheckProps) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
  >
    <motion.path
      d="M5 13l4 4L19 7"
      stroke="#10b981"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: delay + 0.2 }}
    />
  </motion.svg>
);
