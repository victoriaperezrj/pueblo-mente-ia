import { motion } from 'framer-motion';

export const AnimatedHero = () => {
  const words = [
    { text: "De la", color: "text-white" },
    { text: "idea", color: "text-yellow-300" },
    { text: "a los", color: "text-white" },
    { text: "números", color: "text-green-300" },
  ];

  return (
    <h1 className="text-5xl md:text-7xl font-extrabold text-center leading-tight">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.6 }}
          className={`${word.color} inline-block mx-2`}
          style={{
            textShadow: word.color.includes('yellow') || word.color.includes('green')
              ? '0 0 20px currentColor, 0 4px 20px rgba(0,0,0,0.8)'
              : '0 4px 20px rgba(0,0,0,0.8)'
          }}
        >
          {word.text}
        </motion.span>
      ))}
    </h1>
  );
};
