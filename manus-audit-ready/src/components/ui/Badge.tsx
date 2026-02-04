import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary'
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variant === 'default' && 'dark:bg-amber-500/20 dark:text-amber-400',
        variant === 'outline' && 'border dark:border-border-subtle dark:text-text-primary',
        variant === 'secondary' && 'dark:bg-surface-muted dark:text-text-muted',
        className
      )}
    >
      {children}
    </span>
  )
}
