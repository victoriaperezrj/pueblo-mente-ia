import { motion } from 'framer-motion';

export const FloatingOrbs = () => {
  const orbs = [
    { 
      size: 600, 
      color: 'rgba(102, 126, 234, 0.6)', 
      x: '10%', 
      y: '20%', 
      delay: 0,
      duration: 15 
    },
    { 
      size: 550, 
      color: 'rgba(237, 100, 166, 0.5)', 
      x: '75%', 
      y: '40%', 
      delay: 2,
      duration: 18
    },
    { 
      size: 500, 
      color: 'rgba(52, 211, 153, 0.5)', 
      x: '45%', 
      y: '65%', 
      delay: 4,
      duration: 20
    },
    { 
      size: 450, 
      color: 'rgba(168, 85, 247, 0.45)', 
      x: '60%', 
      y: '15%', 
      delay: 6,
      duration: 22
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
            filter: 'blur(60px)',
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
