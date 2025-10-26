import { motion } from 'framer-motion'
import { useSuggestedQuestions } from '../../hooks/useSuggestedQuestions'

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void
}

const SuggestedQuestions = ({ onQuestionClick }: SuggestedQuestionsProps) => {
  const { questions } = useSuggestedQuestions()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-3 sm:px-4 py-4 sm:py-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-2 sm:mb-3">
          Bienvenue sur Harena
        </h1>
        <p className="text-base sm:text-lg text-gray-500">
          Que veux-tu savoir sur tes finances aujourd'hui ?
        </p>
      </motion.div>

      {/* Questions Grid - Responsive */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full mb-4 sm:mb-8"
      >
        {questions.map((q, index) => (
          <motion.button
            key={index}
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuestionClick(q.question)}
            className="group relative bg-white hover:bg-gray-50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-left border border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            <p className="text-xs sm:text-sm text-gray-700 leading-snug">
              {q.question}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

export default SuggestedQuestions
