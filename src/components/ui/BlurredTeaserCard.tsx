'use client'
import React from 'react'
import { Lock } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface BlurredItem {
  id?: string
  name: string
  brand: string
  matchScore: number
}

interface BlurredTeaserCardProps {
  title?: string
  brand?: string
  matchPercentage?: number
  matchRange?: string
  items?: BlurredItem[]
  tier?: 'GUEST' | 'FREE'
  userTier?: 'guest' | 'free' | 'premium'
  onUpgrade?: () => void
}

export function BlurredTeaserCard({ 
  title, 
  brand, 
  matchPercentage = 85,
  matchRange,
  items,
  tier,
  userTier,
  onUpgrade
}: BlurredTeaserCardProps) {
  const router = useRouter()
  const t = useTranslations('results.blurred')
  
  // Handle old interface (items array)
  if (items && items.length > 0) {
    const averageMatch = Math.round(
      items.reduce((sum, i) => sum + i.matchScore, 0) / items.length
    )
    
    const currentTier = userTier?.toUpperCase() || tier || 'GUEST'
    const message = currentTier === 'GUEST' ? t('guestMessage') : t('freeMessage')
    const ctaText = currentTier === 'GUEST' ? t('guestCta') : t('freeCta')
    
    const handleClick = () => {
      if (tier === 'GUEST') {
        signIn()
      } else {
        onUpgrade?.() || router.push('/pricing')
      }
    }
    
    return (
      <div className="relative overflow-hidden rounded-2xl border border-card-border dark:border-border-subtle bg-white dark:bg-surface p-8" dir="rtl">
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/70 dark:bg-surface/70" />
        <div className="relative z-20 text-center space-y-6">
          {/* Lock icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-warm/10 dark:bg-amber-500/10">
            <Lock className="w-6 h-6 text-accent-warm dark:text-amber-400" strokeWidth={2} />
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {items.slice(0, 3).map((item, idx) => (
              <div key={item.id ?? idx} className="rounded-lg border border-card-border dark:border-border-subtle bg-surface-muted dark:bg-surface-muted px-3 py-2 text-center">
                <p className="text-xs text-text-muted">{item.brand}</p>
                <p className="truncate w-20 text-xs font-medium text-text-primary dark:text-text-primary">{item.name}</p>
                <p className="text-xs text-accent-warm dark:text-amber-400 font-bold mt-0.5">{item.matchScore}%</p>
              </div>
            ))}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary">
            {t('title', { count: items.length })}
          </h3>
          <p className="text-sm text-text-secondary dark:text-text-muted">{message}</p>
          <p className="text-4xl font-bold tracking-tight text-text-primary dark:text-text-primary tabular-nums">{matchRange || `${averageMatch}%`}</p>
          <p className="text-xs text-text-muted">{t('avgMatchLabel')}</p>
          <button
            onClick={handleClick}
            className="w-full py-3 px-8 bg-primary dark:bg-amber-600 hover:bg-primary/90 dark:hover:bg-amber-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all"
            aria-label={ctaText}
          >
            {ctaText}
          </button>
        </div>
      </div>
    )
  }
  
  // New interface (single card)
  return (
    <div className="w-full max-w-sm bg-white dark:bg-surface rounded-2xl shadow-sm overflow-hidden border border-card-border dark:border-border-subtle">
      <div className="relative w-full aspect-[4/5] flex items-center justify-center p-8 mt-2 bg-surface-muted dark:bg-surface-muted">
        <div className="absolute inset-0 backdrop-blur-md bg-black/20 dark:bg-black/40" />
        <Lock className="w-16 h-16 text-white/70 relative z-10" />
      </div>
      <div className="relative px-6 pb-6 pt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            {t('locked')}
          </span>
          <span className="text-accent-warm dark:text-amber-400 text-sm font-bold">{brand}</span>
        </div>
        <div className="flex flex-col gap-2">
          {title && <p className="truncate min-w-[72px] max-w-[120px] text-text-primary dark:text-text-primary font-medium">{title}</p>}
          <div className="h-6 bg-surface-muted dark:bg-surface-muted rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-surface-muted dark:bg-surface-muted rounded-lg w-full animate-pulse" />
        </div>
        <div className="h-px w-full bg-card-border dark:bg-border-subtle" />
        <button 
          onClick={() => {
            if (!tier || tier === 'GUEST') {
              signIn()
            } else {
              router.push('/pricing')
            }
          }}
          className="w-full min-touch-target rounded-full font-bold text-base bg-primary dark:bg-amber-600 hover:bg-primary/90 dark:hover:bg-amber-700 text-white transition-all"
          aria-label={t('subscribeCta')}
        >
          {t('subscribeCta')}
        </button>
      </div>
    </div>
  )
}
