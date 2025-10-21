import { motion } from 'framer-motion';

export const FloatingOrbs = () => {
  const orbs = [
    { 
      size: 400, 
      color: 'rgba(102, 126, 234, 0.4)', 
      x: '20%', 
      y: '30%', 
      delay: 0,
      duration: 15 
    },
    { 
      size: 350, 
      color: 'rgba(237, 100, 166, 0.3)', 
      x: '70%', 
      y: '50%', 
      delay: 2,
      duration: 18
    },
    { 
      size: 300, 
      color: 'rgba(52, 211, 153, 0.3)', 
      x: '50%', 
      y: '70%', 
      delay: 4,
      duration: 20
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: orb.x,
            top: orb.y,
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
