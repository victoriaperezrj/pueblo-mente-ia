import { motion } from 'framer-motion';

export const FloatingParticles = () => {
  const particles = [...Array(60)].map(() => ({
    size: 2 + Math.random() * 4,
    color: ['purple', 'blue', 'pink', 'green', 'yellow'][Math.floor(Math.random() * 5)],
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  const colorClasses = {
    purple: 'bg-purple-400',
    blue: 'bg-blue-400',
    pink: 'bg-pink-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${colorClasses[particle.color as keyof typeof colorClasses]}`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 ${particle.size * 2}px currentColor`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
