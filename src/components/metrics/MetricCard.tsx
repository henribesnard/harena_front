import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  icon?: LucideIcon
  emoji?: string
  children: ReactNode
  className?: string
  loading?: boolean
  error?: boolean
}

export const MetricCard = ({
  title,
  icon: Icon,
  emoji,
  children,
  className = '',
  loading = false,
  error = false
}: MetricCardProps) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-primary-600" />}
        {emoji && <span className="text-xl">{emoji}</span>}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-100 animate-pulse rounded w-3/4"></div>
        </div>
      ) : error ? (
        <div className="text-danger-main text-sm">
          Erreur de chargement
        </div>
      ) : (
        children
      )}
    </div>
  )
}
