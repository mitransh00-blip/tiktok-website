import { motion } from "framer-motion";

export default function AnimatedLogo({ size = "small" }) {
  const sizes = {
    small: "text-2xl",
    medium: "text-4xl",
    large: "text-6xl",
  };

  const iconSizes = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-20 h-20",
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`${iconSizes[size]} bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30`}
      >
        <span className="text-white font-bold text-xs">M</span>
      </motion.div>
      
      <motion.span
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={`${sizes[size]} font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent tracking-tight`}
      >
        MITRANSH
      </motion.span>
    </motion.div>
  );
}
