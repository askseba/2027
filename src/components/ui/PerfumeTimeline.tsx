'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'

export interface TimelineStage {
  score: number
  status: 'safe' | 'warning' | 'danger'
  notes?: string
  stageName?: string
}

export interface PerfumeTimelineProps {
  stages: TimelineStage[]
  className?: string
}

export function PerfumeTimeline({ stages, className = '' }: PerfumeTimelineProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const getStatusConfig = (status: 'safe' | 'warning' | 'danger') => {
    switch (status) {
      case 'safe':
        return {
          bg: 'bg-[#fef3c7]',
          border: 'border-safe-green',
          borderColor: 'var(--color-safe-green)',
          circleColors: ['#F8C8DC', '#D2B48C', '#90EE90'],
          badge: 'bg-safe-green text-white'
        }
      case 'warning':
        return {
          bg: 'bg-[#dbeafe]',
          border: 'border-warning-orange',
          borderColor: 'var(--color-warning-amber)',
          circleColors: ['#F8C8DC', '#D2B48C', '#90EE90'],
          badge: 'bg-warning-orange text-white'
        }
      case 'danger':
        return {
          bg: 'bg-[#ecfdf5]',
          border: 'border-danger-red',
          borderColor: 'var(--color-danger-red)',
          circleColors: ['#F8C8DC', '#D2B48C', '#90EE90'],
          badge: 'bg-danger-red text-white'
        }
    }
  }

  const renderProgressCircle = (stage: TimelineStage) => {
    const config = getStatusConfig(stage.status)
    const circumference = 2 * Math.PI * 50 // r=50

    return (
      <svg 
        viewBox="0 0 200 200" 
        className="w-32 h-32 flex-shrink-0"
        aria-label={`Progress circle showing ${stage.score}% match`}
      >
        {/* Background circles */}
        <circle 
          cx="100" 
          cy="100" 
          r="50" 
          fill="none" 
          stroke={config.circleColors[0]} 
          strokeWidth="8" 
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - (stage.score / 100) * circumference}
          className="transition-all duration-500"
          transform="rotate(-90 100 100)"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="40" 
          fill="none" 
          stroke={config.circleColors[1]} 
          strokeWidth="6" 
          strokeDasharray={`${circumference * 0.8} ${circumference * 0.8}`}
          strokeDashoffset={(circumference * 0.8) - ((stage.score / 100) * circumference * 0.8)}
          className="transition-all duration-500"
          transform="rotate(-90 100 100)"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="30" 
          fill="none" 
          stroke={config.circleColors[2]} 
          strokeWidth="4" 
          strokeDasharray={`${circumference * 0.6} ${circumference * 0.6}`}
          strokeDashoffset={(circumference * 0.6) - ((stage.score / 100) * circumference * 0.6)}
          className="transition-all duration-500"
          transform="rotate(-90 100 100)"
        />
        
        {/* Score text */}
        <text 
          x="100" 
          y="110" 
          textAnchor="middle" 
          className="text-xl font-bold fill-brown-text"
          aria-hidden="true"
        >
          {stage.score}%
        </text>
      </svg>
    )
  }

  return (
    <div 
      className={`w-[320px] h-[120px] bg-cream-bg rounded-2xl p-4 shadow-timeline flex flex-col gap-2 ${className}`}
      dir="rtl"
      role="region"
      aria-label="Perfume compatibility timeline"
    >
      {stages.map((stage, index) => {
        const config = getStatusConfig(stage.status)
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              zIndex: 10
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
              config.bg
            } ${config.border} ${
              hoveredIndex === index ? 'ring-2 ring-offset-2 ring-offset-cream-bg' : ''
            }`}
            style={{ borderColor: config.borderColor }}
            role="group"
            aria-label={`Stage ${index + 1}: ${stage.score}% match, ${stage.status} status`}
          >
            {/* SVG ProgressCircle 200x120 */}
            <div className="flex-shrink-0 hidden sm:block">
              {renderProgressCircle(stage)}
            </div>
            
            {/* Mobile: Smaller circle */}
            <div className="flex-shrink-0 sm:hidden">
              <svg 
                viewBox="0 0 200 120" 
                className="w-16 h-16"
                aria-label={`Progress circle showing ${stage.score}% match`}
              >
                <circle 
                  cx="100" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke={getStatusConfig(stage.status).circleColors[0]} 
                  strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 50} ${2 * Math.PI * 50}`}
                  strokeDashoffset={(2 * Math.PI * 50) - ((stage.score / 100) * 2 * Math.PI * 50)}
                  className="transition-all duration-500"
                  transform="rotate(-90 100 60)"
                />
                <text 
                  x="100" 
                  y="65" 
                  textAnchor="middle" 
                  className="text-sm font-bold fill-brown-text"
                  aria-hidden="true"
                >
                  {stage.score}%
                </text>
              </svg>
            </div>
            
            {/* Stage Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-brown-text text-sm mb-1 truncate">
                {stage.stageName || `Stage ${index + 1}`}: {stage.score}%
              </p>
              <span 
                className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${config.badge}`}
                aria-label={`Status: ${stage.status}`}
              >
                {stage.status.toUpperCase()}
              </span>
              {stage.notes && (
                <p className="text-xs text-brown-text/85 mt-1 line-clamp-2" aria-label={`Notes: ${stage.notes}`}>
                  {stage.notes}
                </p>
              )}
            </div>

            {/* Hover Tooltip Glow */}
            {hoveredIndex === index && stage.notes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-full me-4 bg-brown-text text-white px-4 py-2 rounded-lg shadow-lg z-20 max-w-xs"
                role="tooltip"
                aria-live="polite"
              >
                <p className="text-sm whitespace-nowrap">{stage.notes}</p>
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-brown-text"></div>
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
