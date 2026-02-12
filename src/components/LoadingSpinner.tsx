'use client'
import React from 'react'

interface LoadingSpinnerProps {
  type?: 1 | 2 | 3
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ 
  type = 3, 
  message = 'جاري التحميل...',
  size = 'md',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  if (type === 3) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message || 'جاري التحميل...'}
        className={`flex flex-col items-center gap-4 ${className}`}
      >
        {/* Main Icon */}
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gradient-start to-primary shadow-[0_0_30px_rgba(193,132,26,0.3)] flex items-center justify-center`}>
          <svg className={`${size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'} text-white`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>

        {/* Bouncing Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 200, 400].map((delay, i) => (
            <div
              key={i}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gradient-to-br from-gradient-start to-primary shadow-lg animate-bounce`}
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>

        {/* Loading Text */}
        {message && (
          <div className="text-center">
            <p className="text-sm font-medium text-brown-text dark:text-text-secondary">{message}</p>
          </div>
        )}
      </div>
    )
  }

  if (type === 1) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message || 'جاري التحميل...'}
        className={`flex items-center justify-center ${className}`}
      >
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`${sizeClasses[size]} rounded-full border-4 border-primary/20 border-t-primary animate-spin absolute`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (type === 2) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message || 'جاري التحميل...'}
        className={`flex flex-col items-center gap-4 ${className}`}
      >
        <div className="w-48 h-2 bg-primary/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-gradient-start to-primary rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
        {message && (
          <p className="text-sm text-brown-text/85 dark:text-text-secondary">{message}</p>
        )}
      </div>
    )
  }

  return null
}

export default LoadingSpinner
