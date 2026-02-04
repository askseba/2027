// src/components/ui/SpeedometerGauge.tsx
'use client'
import { motion } from 'framer-motion'
import { useLayoutEffect, useState } from 'react'

interface SpeedometerProps {
  score: number
  status: 'danger' | 'warning' | 'safe'
}

export function SpeedometerGauge({ score, status }: SpeedometerProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  // Prevent layout shift: initialize with 0, animate after mount
  useLayoutEffect(() => {
    setAnimatedScore(0)
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const getStatusText = () => {
    if (score < 60) return '⚠️ تحذير حساسية'
    if (score < 80) return '🟡 جرب عينة أولاً'
    return 'آمن وموصى به' // ✅ مختصر - سطر واحد
  }

  const getStatusAriaLabel = () => {
    if (score < 60) return 'تحذير: قد يسبب حساسية'
    if (score < 80) return 'تحذير: يُنصح بتجربة عينة أولاً'
    return 'آمن: موصى به للشراء'
  }

  // Mathematical formula for rotation angle in RTL
  // Arc: 0% (left) = -90°, 50% (center) = 0°, 100% (right) = 90°
  // Formula: rotation = (score / 100) * 180 - 90
  // For 90%: (90/100) * 180 - 90 = 72°
  const rotation = (score / 100) * 180 - 90

  // Color definitions with WCAG AA contrast compliance
  const statusColors = {
    safe: {
      gradient: 'var(--color-safe-green)',
      bg: 'var(--color-safe-green)', // green-100
      text: '#065F46', // green-800 (WCAG AA: 7.2:1)
      border: 'var(--color-safe-green)'
    },
    warning: {
      gradient: 'var(--color-warning-amber)',
      bg: 'var(--color-warning-amber)', // amber-100
      text: '#92400E', // amber-800 (WCAG AA: 6.8:1)
      border: 'var(--color-warning-amber)'
    },
    danger: {
      gradient: 'var(--color-danger-red)',
      bg: 'var(--color-danger-red)', // red-100
      text: '#991B1B', // red-800 (WCAG AA: 7.1:1)
      border: 'var(--color-danger-red)'
    }
  }

  const colors = statusColors[status]

  // SVG Arc center coordinates (in viewBox: 0 0 280 180)
  // Arc path: M 20 90 Q 140 10 260 90
  // Center of circle: (140, 90)
  const arcCenterX = 140
  const arcCenterY = 90

  return (
    <div 
      className="w-[280px] mx-auto mb-8"
      dir="rtl"
      role="region"
      aria-label={`مقياس التوافق: ${score}%`}
    >
      {/* Encapsulated Container - Single Solid Block */}
      <div 
        className="bg-cream-bg rounded-3xl py-6 px-6 relative"
      >
        {/* Gauge Arc Container */}
        <div className="relative w-full h-[180px]">
          {/* SVG Arc */}
          <svg 
            viewBox="0 0 280 180" 
            className="w-full h-full"
            role="meter"
            aria-label={`توافق ${score}%`}
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${score} بالمئة`}
          >
            <defs>
              <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-danger-red)" />
                <stop offset="100%" stopColor="var(--color-danger-red)" />
              </linearGradient>
              <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-warning-amber)" />
                <stop offset="100%" stopColor="var(--color-warning-amber)" />
              </linearGradient>
              <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-safe-green)" />
                <stop offset="100%" stopColor="var(--color-safe-green)" />
              </linearGradient>
            </defs>
            
            {/* Danger Zone Arc (0-59%) - Left side */}
            <path 
              d="M 20 90 Q 140 10 260 90" 
              fill="none"
              stroke="url(#dangerGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              aria-hidden="true"
            />
            
            {/* Warning Zone Arc (60-79%) - Middle */}
            <path 
              d="M 20 90 Q 140 10 260 90" 
              fill="none"
              stroke="url(#warningGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray="283 283"
              strokeDashoffset="113"
              aria-hidden="true"
            />
            
            {/* Safe Zone Arc (80-100%) - Right side */}
            <path 
              d="M 20 90 Q 140 10 260 90" 
              fill="none"
              stroke="url(#safeGradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray="283 283"
              strokeDashoffset="57"
              aria-hidden="true"
            />
          </svg>

          {/* Center Percentage - Perfectly centered in arc cavity */}
          {/* Arc bottom: y=90, Needle pivot: y=90, Perfect center: y=90 */}
          {/* Position: 50% from top (90px) = center of arc circle */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <motion.div 
              className="text-3xl font-black text-brown-text"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.8 }}
              aria-label={`${Math.round(animatedScore)} بالمئة`}
            >
              {Math.round(animatedScore)}%
            </motion.div>
          </div>

          {/* Animated Needle - Pivot from arc center (140, 90) */}
          <motion.div 
            className="absolute w-[8px] h-20 bg-gradient-to-t from-gray-900 to-black rounded-full shadow-lg z-10"
            style={{ 
              // Pivot point: center of arc circle (140, 90) = 50% left, 50% top
              left: '50%',
              top: '50%',
              // Transform origin: bottom center of needle (pivot point)
              transformOrigin: 'center bottom',
              // Position: translate to center, then move up by needle height
              transform: 'translate(-50%, -100%)'
            }}
            animate={{ rotate: `${rotation}deg` }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            aria-hidden="true"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full shadow-lg border-4 border-white" />
          </motion.div>
        </div>

        {/* Status Badge - Below needle, inside container */}
        <div 
          className="mt-4 text-center"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div 
            className="text-sm font-bold px-3 py-1.5 rounded-full shadow-md inline-block whitespace-nowrap"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: `2px solid ${colors.border}`
            }}
            aria-label={getStatusAriaLabel()}
          >
            {getStatusText()}
          </div>
        </div>
      </div>
    </div>
  )
}
