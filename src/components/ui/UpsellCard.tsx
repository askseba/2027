// src/components/ui/UpsellCard.tsx
'use client'
import { Crown, Infinity, Bell, Lock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface UpsellCardProps {
  position: 'mid-grid' | 'bottom'
  remainingCount: number
  averageMatch?: number
  onUpgrade?: () => void
}

export function UpsellCard({ position, remainingCount, averageMatch, onUpgrade }: UpsellCardProps) {
  const t = useTranslations('results.upsell')
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      // HOTFIX: explicit dark:bg-slate-900 + dark:border-slate-700
      className={`relative overflow-hidden rounded-2xl border border-card-border dark:border-slate-700 bg-white dark:bg-slate-900 ${position === 'bottom' ? 'col-span-full mt-12' : 'col-span-1'}`}
      dir="rtl"
    >
      <div className={`grid gap-0 ${position === 'bottom' ? 'md:grid-cols-2' : ''}`}>
        {/* Right (RTL): Info */}
        <div className="flex flex-col justify-center p-8 md:p-10">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Crown className="h-3.5 w-3.5" />
          </div>

          <h2 className="mb-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-100 text-balance">
            {t('title', { count: remainingCount })}
          </h2>
          {averageMatch && (
            <p className="mb-6 text-base text-gray-500 dark:text-slate-400 leading-relaxed">
              {t('avgMatch')} <span className="tabular-nums">{averageMatch}%</span>
            </p>
          )}
        
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-900 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
                <Infinity className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </div>
              <span>{t('featureUnlimited')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-900 dark:text-slate-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
                <Bell className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </div>
              <span>{t('featureAlerts')}</span>
            </div>
          </div>
        
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/pricing"
              onClick={() => onUpgrade?.()}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary dark:bg-amber-600 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white shadow-sm transition-all hover:bg-primary/90 dark:hover:bg-amber-700 hover:shadow-md"
              aria-label={t('ctaWithPrice')}
            >
              <span>{t('ctaWithPrice')}</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Left (RTL): Visual stat card — bottom position, desktop only */}
        {position === 'bottom' && (
          <div className="relative hidden md:flex items-center justify-center bg-gray-50 dark:bg-slate-800 p-8 md:p-12">
            <div className="relative w-full max-w-xs">
              {/* Decorative stacked cards */}
              <div className="absolute -top-4 -right-4 h-full w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/30 backdrop-blur-sm" />
              <div className="absolute -top-2 -right-2 h-full w-full rounded-2xl border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm" />
              {/* Main stat card */}
              <div className="relative rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">{t('avgMatch')}</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    <Lock className="h-3 w-3" />
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-slate-100 tabular-nums">
                    {averageMatch ?? '-'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
