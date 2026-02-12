// VALUE_LADDER - File 7/20: src/components/ui/UpsellCard.tsx
// ✅ COMPLETE UPSELL CARD FOR FREE USERS
// 🎯 Shows after 5 results for Free tier

'use client'
import { Crown, Check, Bell, ArrowLeft } from 'lucide-react'
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
      className={`relative bg-gradient-to-br from-amber-500/10 via-primary/5 to-purple-600/10 rounded-3xl p-6 md:p-8 border-2 border-amber-500/30 shadow-xl overflow-hidden ${position === 'bottom' ? 'col-span-full mt-12' : 'col-span-1'}`}
      dir="rtl"
    >
      {/* Crown badge */}
      <div className="absolute top-4 start-4 z-10">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3 rounded-full shadow-lg">
          <Crown className="w-6 h-6 text-white" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        <div className="space-y-3 mb-6">
          <h3 className="text-2xl md:text-3xl font-black text-brown-text dark:text-text-primary leading-tight">
            {t('title', { count: remainingCount })}
          </h3>
          {averageMatch && (
            <p className="text-lg font-bold text-primary dark:text-amber-500">
              {t('avgMatch')} <span className="tabular-nums">{averageMatch}%</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-3 mb-8 max-w-sm mx-auto">
          <span className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-muted">
            <Check className="w-4 h-4 text-safe-green flex-shrink-0" />
            {t('featureUnlimited')}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-text-secondary dark:text-text-muted">
            <Bell className="w-4 h-4 text-primary dark:text-amber-400 flex-shrink-0" />
            {t('featureAlerts')}
          </span>
        </div>
        
        <Link
          href="/pricing"
          onClick={() => onUpgrade?.()}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center"
          aria-label={t('ctaWithPrice')}
        >
          <Crown className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span>{t('ctaWithPrice')}</span>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
