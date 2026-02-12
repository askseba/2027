'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ShieldCheck, ArrowRightLeft, Star, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/classnames'
import { Button } from './button'
import { SafetyWarnings } from '@/components/SafetyWarnings'
import type { ScoredPerfume } from '@/lib/matching'

interface PerfumeCardProps {
  id: string
  name?: string
  title?: string // Backward compatibility
  brand: string
  finalScore?: number
  matchPercentage?: number // Backward compatibility
  image?: string
  imageUrl?: string // Backward compatibility
  description?: string | null
  isSafe?: boolean
  showCompare?: boolean
  isComparing?: boolean
  onCompare?: () => void
  rarity?: 'common' | 'rare' | 'exclusive'
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock'
  variant?: 'on-sale' | 'just-arrived' | string | null // Backward compatibility
  priority?: boolean // ✅ prop جديد لتحسين LCP
  ifraScore?: number
  symptomTriggers?: string[]
  ifraWarnings?: string[]
  source?: string
  /** Highlight as top match (first result) */
  isTopMatch?: boolean
  /** Callback when "Compare Prices" is clicked; receives full perfume for Price Hub */
  onPriceCompare?: (perfume: ScoredPerfume) => void
  /** Full perfume data to pass to onPriceCompare (required when onPriceCompare is used) */
  perfumeData?: ScoredPerfume
}

export function PerfumeCard({ 
  id,
  name,
  title,
  brand,
  finalScore,
  matchPercentage,
  image,
  imageUrl,
  description,
  isSafe = true,
  showCompare = false,
  isComparing = false,
  onCompare,
  rarity = 'rare',
  stockStatus = 'in-stock',
  priority = false, // ✅ القيمة الافتراضية false
  ifraScore,
  symptomTriggers,
  ifraWarnings,
  source,
  isTopMatch = false,
  onPriceCompare,
  perfumeData
}: PerfumeCardProps) {
  const t = useTranslations('results.card')
  const displayName = name || title || t('unknownPerfume')
  const displayScore = finalScore ?? matchPercentage ?? 0
  const displayImage = image || imageUrl

  const [imageError, setImageError] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-safe-green'
    if (score >= 65) return 'text-warning-amber'
    return 'text-danger-red'
  }

  const getScoreColorDark = (score: number) => {
    if (score >= 85) return 'dark:text-green-400'
    if (score >= 65) return 'dark:text-amber-400'
    return 'dark:text-red-400'
  }

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`${displayName} - ${displayScore}% ${t('match')}`}
      className={cn(
        'group relative bg-white dark:bg-surface rounded-3xl shadow-elevation-1 dark:shadow-black/20 border border-primary/5 dark:border-border-subtle overflow-hidden hover:shadow-elevation-3 dark:hover:shadow-black/30 transition-all duration-500 flex flex-col h-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isTopMatch && 'border-2 border-primary/30 shadow-elevation-2'
      )}
    >
      {/* Top Match badge */}
      {isTopMatch && (
        <div className="absolute top-3 start-3 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/90 dark:bg-amber-500/90 text-white text-xs font-semibold shadow-sm">
            {t('topMatch')}
          </span>
        </div>
      )}
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          {isSafe && displayScore >= 70 && (
            <div
              role="button"
              tabIndex={0}
              aria-label={t('safeBadge')}
              className="bg-safe-green/90 dark:bg-green-600 backdrop-blur-md !text-white opacity-100 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
            >
              <ShieldCheck className="w-3 h-3" />
              {t('safe')}
            </div>
          )}
          {rarity === 'exclusive' && (
            <div className="bg-primary dark:bg-amber-600 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              {t('exclusive')}
            </div>
          )}
        </div>
        
        <div
          className="bg-white/95 dark:bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-primary/10 dark:border-border-subtle flex flex-col items-center pointer-events-auto"
          aria-label={`${t('matchScore')} ${displayScore}%`}
        >
          <span className="text-2xl font-black leading-none text-text-primary dark:text-text-primary">{displayScore}%</span>
          <span className="text-[10px] font-bold text-text-secondary dark:text-slate-300 uppercase tracking-tight">{t('match')}</span>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/5] w-full bg-cream-bg dark:bg-background overflow-hidden">
        <Image
          src={imageError || !displayImage ? '/placeholder-perfume.svg' : displayImage}
          alt={displayName}
          fill
          className="object-contain p-5 transition-transform duration-700 group-hover:scale-110"
          priority={priority} // ✅ تمرير خاصية priority
          loading={priority ? undefined : "lazy"} // ✅ تعطيل lazy loading إذا كانت الأولوية عالية
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-surface-elevated/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <p className="text-primary dark:text-amber-500 font-bold text-xs mb-1 tracking-widest uppercase">{brand}</p>
          <h3 className="text-xl font-bold text-text-primary dark:text-text-primary line-clamp-1 group-hover:text-primary transition-colors">{displayName}</h3>
        </div>

        <p className="text-text-secondary dark:text-text-muted text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
          {description || t('defaultDesc')}
        </p>

        {ifraScore !== undefined && (
          <div className="mt-2 p-2 bg-cream-bg dark:bg-surface-muted rounded-lg border border-safe-green/10 dark:border-border-subtle">
            <SafetyWarnings
              perfume={{ id, name: displayName, brand, symptomTriggers: symptomTriggers ?? [], source: source ?? 'local' } as any}
              ifraScore={ifraScore}
              warnings={ifraWarnings}
              className="w-full"
            />
            {process.env.NODE_ENV === 'development' && source && (
              <p className="text-xs text-muted-foreground dark:text-text-muted mt-1">
                Source: {source}
              </p>
            )}
          </div>
        )}

        {stockStatus === 'low-stock' && (
          <div className="flex items-center gap-4 mb-6 py-3 border-y border-primary/5 dark:border-border-subtle">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-danger-red dark:text-red-400" />
              <span className="text-[10px] font-bold text-danger-red dark:text-red-400">{t('lowStock')}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button className="flex-1 shadow-button" size="sm">
              {t('explore')}
            </Button>
            {showCompare && (
              <Button 
                variant={isComparing ? "primary" : "outline"} 
                size="icon"
                onClick={(e) => {
                  e.preventDefault();
                  onCompare?.();
                }}
                className={cn("rounded-xl transition-all", isComparing && "bg-primary text-white")}
                aria-label={t('compareLabel')}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
          {onPriceCompare && perfumeData && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPriceCompare(perfumeData);
              }}
              className="flex items-center justify-center gap-1.5 text-sm font-medium text-primary dark:text-amber-500 hover:underline transition"
              aria-label={t('comparePricesAction')}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10v10M7 17L17 7" />
              </svg>
              {t('comparePricesAction')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
