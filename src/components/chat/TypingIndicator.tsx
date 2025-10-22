import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1.5 mt-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default TypingIndicator
