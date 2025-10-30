/**
 * InfoTooltip - Tooltip réutilisable pour afficher des explications
 * Affiche une icône Info avec un tooltip au survol
 */

import React from 'react'
import { Info } from 'lucide-react'

interface InfoTooltipProps {
  content: string | React.ReactNode
  className?: string
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className = '' }) => {
  return (
    <div className={`group relative inline-block ${className}`}>
      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors" />
      <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded-lg py-2 px-3 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="whitespace-normal">{content}</div>
        {/* Triangle pointer */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  )
}
