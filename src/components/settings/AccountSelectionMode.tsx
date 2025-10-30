/**
 * AccountSelectionMode - Sélecteur de mode de filtrage des comptes
 *
 * Permet à l'utilisateur de choisir parmi 3 modes:
 * - all: Tous les comptes éligibles
 * - exclude_types: Exclure certains types
 * - include_specific: Comptes spécifiques
 */

import React from 'react'
import { Check } from 'lucide-react'

type SelectionMode = 'all' | 'exclude_types' | 'include_specific'

interface AccountSelectionModeProps {
  value: SelectionMode
  onChange: (mode: SelectionMode) => void
  disabled?: boolean
}

interface ModeOption {
  value: SelectionMode
  label: string
  description: string
}

const modes: ModeOption[] = [
  {
    value: 'all',
    label: 'Tous les comptes éligibles',
    description: 'Inclure automatiquement tous les comptes courants et cartes bancaires'
  },
  {
    value: 'exclude_types',
    label: 'Exclure certains types',
    description: 'Exclure soit les comptes courants, soit les cartes bancaires'
  },
  {
    value: 'include_specific',
    label: 'Comptes spécifiques',
    description: 'Choisir manuellement les comptes à inclure dans les calculs'
  }
]

export const AccountSelectionMode: React.FC<AccountSelectionModeProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-3">
      {modes.map((mode) => {
        const isSelected = value === mode.value
        return (
          <button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            disabled={disabled}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all
              ${isSelected
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-start gap-3">
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                ${isSelected
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300 bg-white'
                }
              `}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                  {mode.label}
                </h4>
                <p className="text-sm text-gray-600">
                  {mode.description}
                </p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
