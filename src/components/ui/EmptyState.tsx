'use client'
import { ReactNode } from 'react'
import { Button } from './button'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  ctaLabel: string
  ctaHref?: string
  ctaOnClick?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  ctaOnClick,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
      {/* Icon with background circle */}
      <div className="mb-8 relative">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 dark:from-amber-500/20 dark:to-amber-500/10 flex items-center justify-center">
          <div className="text-6xl opacity-70 dark:opacity-90">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-bold text-brown-text dark:text-text-primary mb-4">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-brown-text/75 dark:text-text-muted text-base sm:text-lg max-w-md mb-10 leading-relaxed">
        {description}
      </p>
      
      {/* CTA Button */}
      {ctaHref ? (
        <Button href={ctaHref} variant="primary" size="lg">
          {ctaLabel}
        </Button>
      ) : ctaOnClick ? (
        <Button onClick={ctaOnClick} variant="primary" size="lg">
          {ctaLabel}
        </Button>
      ) : null}
    </div>
  )
}
