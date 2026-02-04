"use client"
import React from 'react'
import { Search, Bookmark, Heart, Package } from 'lucide-react'

interface CounterBadgeProps {
  variant?: 'search' | 'bookmarks' | 'matches' | 'samples'
  count: number
  label?: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

const variantConfig = {
  search: {
    icon: Search,
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-500 dark:text-blue-400',
    hoverBg: 'hover:bg-blue-500/20 dark:hover:bg-blue-500/30'
  },
  bookmarks: {
    icon: Bookmark,
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-500 dark:text-purple-400',
    hoverBg: 'hover:bg-purple-500/20 dark:hover:bg-purple-500/30'
  },
  matches: {
    icon: Heart,
    bgColor: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-500 dark:text-green-400',
    hoverBg: 'hover:bg-green-500/20 dark:hover:bg-green-500/30'
  },
  samples: {
    icon: Package,
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/20',
    iconColor: 'text-orange-500 dark:text-orange-400',
    hoverBg: 'hover:bg-orange-500/20 dark:hover:bg-orange-500/30'
  }
}

export function CounterBadge({
  variant = 'search',
  count,
  label,
  icon,
  className = '',
  onClick
}: CounterBadgeProps) {
  const config = variantConfig[variant]
  const IconComponent = config.icon

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-surface rounded-xl p-4 shadow-sm border border-brown-text/10 dark:border-border-subtle
        hover:shadow-md transition-all group
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Icon */}
      <div className={`
        w-10 h-10 rounded-full ${config.bgColor} ${config.hoverBg}
        flex items-center justify-center ${config.iconColor}
        group-hover:scale-110 transition-transform mb-3
      `}>
        {icon || <IconComponent className="w-5 h-5" />}
      </div>
      
      {/* Counter */}
      <div>
        <span className="text-2xl font-tajawal-bold block text-brown-text dark:text-text-primary">
          {count}
        </span>
        {label && <span className="text-xs text-brown-text/75 dark:text-text-muted">{label}</span>}
      </div>
    </div>
  )
}

export default CounterBadge
