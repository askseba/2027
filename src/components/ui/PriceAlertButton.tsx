'use client'

import { useState } from 'react'
import { Bell, Crown } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/classnames'

export interface PriceAlertButtonProps {
  perfumeId: string
  perfumeName: string
  currentPrice: number
  tier: 'GUEST' | 'FREE' | 'PREMIUM'
  className?: string
}

export function PriceAlertButton({
  perfumeId,
  perfumeName,
  currentPrice,
  tier,
  className
}: PriceAlertButtonProps) {
  const t = useTranslations('results.compare')
  const [loading, setLoading] = useState(false)

  const handleAlert = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfumeId,
          targetPrice: Math.round(currentPrice * 0.9)
        })
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        toast.success(t('priceAlertSuccess', { perfumeName }))
      } else {
        toast.error(data.message || t('priceAlertError'))
      }
    } catch {
      toast.error(t('priceAlertError'))
    } finally {
      setLoading(false)
    }
  }

  if (tier !== 'PREMIUM') {
    return (
      <Link
        href="/pricing"
        className={cn(
          'inline-flex items-center justify-center gap-2 px-6 py-3',
          'bg-gradient-to-r from-amber-500/80 to-amber-600 dark:from-amber-500/90 dark:to-amber-600/90',
          'text-white rounded-xl font-bold text-sm shadow-lg',
          'hover:shadow-amber-500/30 dark:hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
      >
        <Crown className="w-4 h-4 shrink-0" />
        {t('priceAlertSubscribe')}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handleAlert}
      disabled={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 min-h-touch min-w-touch',
        'bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-500 dark:to-amber-600',
        'text-white rounded-xl font-bold text-sm shadow-lg',
        'hover:shadow-amber-500/30 dark:hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
        className
      )}
      aria-label={t('priceAlertCta')}
    >
      <Bell className="w-4 h-4 shrink-0" />
      {loading ? t('priceAlertSetting') : t('priceAlertCtaWithPrice', { price: currentPrice })}
    </button>
  )
}
