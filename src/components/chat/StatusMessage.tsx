import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface StatusMessageProps {
  message: string
}

const StatusMessage = ({ message }: StatusMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 text-sm text-gray-500 italic"
    >
      <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
      <span>{message}</span>
    </motion.div>
  )
}

export default StatusMessage
