"use client"
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Symptom } from '@/lib/data/symptoms'
import { getThemedColor } from '@/lib/utils/color-helpers'

interface SymptomCardProps {
  symptom: Symptom
  isSelected: boolean
  onClick: () => void
}

export function SymptomCard({ symptom, isSelected, onClick }: SymptomCardProps) {
  const { resolvedTheme } = useTheme()

  return (
    <motion.button
      onClick={onClick}
      role="checkbox"
      aria-checked={isSelected ? "true" : "false"}
      aria-label={`${symptom.name} ${isSelected ? 'مُحدد' : 'غير محدد'}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      className={`
        relative p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2
        transition-all duration-300 min-h-[140px] text-right w-full touch-manipulation
        ${isSelected
          ? 'bg-white dark:bg-surface border-4 border-primary dark:border-amber-500 shadow-2xl ring-2 ring-primary/20 dark:ring-amber-500/20'
          : 'bg-white dark:bg-surface border-2 border-dark-brown/20 dark:border-border-subtle hover:border-primary/50 dark:hover:border-amber-500 hover:bg-cream-bg/50 dark:hover:bg-surface-muted'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Color Indicator */}
      <div 
        className="absolute top-4 left-4 w-12 h-12 rounded-full opacity-20"
        style={{ backgroundColor: getThemedColor(symptom.color, resolvedTheme as 'light' | 'dark' | undefined) }}
      />
      
      {/* Icon */}
      <div className="text-4xl mb-3 text-center">{symptom.icon}</div>
      
      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-tajawal-bold text-lg mb-2 leading-tight text-dark-brown dark:text-text-primary">
          {symptom.name}
        </h3>
        <p className="text-sm text-dark-brown/85 dark:text-text-muted leading-relaxed">
          {symptom.description}
        </p>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-6 h-6 bg-primary dark:bg-amber-600 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </motion.button>
  )
}
