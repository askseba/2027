'use client'
import React from 'react'

interface Stat {
  label: string
  value: string | number
  icon?: string
  color?: string
  gradient?: string
}

interface StatsGridProps {
  stats?: Stat[]
  columns?: 2 | 4
  className?: string
}

export function StatsGrid({ 
  stats,
  columns = 4,
  className = '' 
}: StatsGridProps) {
  const defaultStats: Stat[] = [
    { label: 'عمليات البحث', value: 45, icon: 'search', color: 'var(--color-primary)' }, // brand-gold
    { label: 'محفوظات', value: 12, icon: 'bookmark', color: 'var(--color-safe-green)' }, // safe-green
    { label: 'تطابقات', value: 23, icon: 'favorite', color: 'var(--color-warning-amber)' }, // warning-orange
    { label: 'عينات مطلوبة', value: 3, icon: 'science', color: 'var(--color-danger-red)' } // danger-red
  ]

  const displayStats = stats || defaultStats
  const gridCols = columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'

  return (
    <div className={`grid ${gridCols} gap-4 ${className}`}>
      {displayStats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/90 dark:bg-surface/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 flex flex-col gap-2 relative overflow-hidden group hover:shadow-lg hover:bg-primary/5 dark:hover:bg-surface-muted transition-all duration-300 border border-brown-text/10 dark:border-border-subtle"
        >
          {/* Gradient background on hover */}
          {stat.gradient && (
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ background: stat.gradient }}
            />
          )}
          
          {/* Icon */}
          {stat.icon && (
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
              style={{ 
                backgroundColor: stat.color ? `${stat.color}20` : 'rgba(192, 132, 26, 0.1)'
              }}
            >
              <span 
                className="material-symbols-outlined text-xl"
                style={{ color: stat.color || 'var(--color-primary)' }} // brand-gold
              >
                {stat.icon}
              </span>
            </div>
          )}

          {/* Value */}
          <div 
            className="text-2xl md:text-3xl font-bold text-brown-text dark:text-text-primary"
            style={{ color: stat.color || 'var(--color-text-primary)' }}
          >
            {stat.value}
          </div>

          {/* Label */}
          <div className="text-sm text-brown-text/70 dark:text-text-muted font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsGrid
