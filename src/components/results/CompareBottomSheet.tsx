'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, AlertCircle, X, Crown, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PriceAlertButton } from '@/components/ui/PriceAlertButton'
import { cn } from '@/lib/classnames'
import type { ScoredPerfume } from '@/lib/matching'

/** Typed subset of ScoredPerfume fields used by PriceHubContent */
interface PriceHubPerfume {
  id: string
  name: string
  brand: string
  image: string
  fragellaId?: string
  price?: number | null
  purchaseUrl?: string | null
}

export type CompareMode = 'compare' | 'price-hub'

export interface CompareBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  mode: CompareMode
  perfumes?: ScoredPerfume[]
  perfume?: ScoredPerfume
  tier?: 'GUEST' | 'FREE' | 'PREMIUM'
  locale: string
}

// --- Mode B: Price Hub ---
interface StorePrice {
  id: string
  name: string
  logo: string
  price: number
  currency: string
  available: boolean
  url: string
  discountCode: string | null
  discountLabel: string | null
  discountExpiry: string | null
}

/* MOCKSTORES — disabled until real multi-store data available
const MOCKSTORES: StorePrice[] = [
  { id: 'fragrancex', name: 'FragranceX', logo: '/stores/fragrancex.svg', price: 299, available: true, url: 'https://www.fragrancex.com' },
  { id: 'niceone', name: 'Nice One', logo: '/stores/niceone.svg', price: 315, available: true, url: 'https://www.niceonesa.com' },
  { id: 'goldenscent', name: 'Golden Scent', logo: '/stores/goldenscent.svg', price: 330, available: true, url: 'https://www.goldenscent.com' },
  { id: 'noon', name: 'Noon', logo: '/stores/noon.svg', price: 345, available: true, url: 'https://www.noon.com' },
  { id: 'amazon-sa', name: 'Amazon SA', logo: '/stores/amazon.svg', price: 355, available: true, url: 'https://www.amazon.sa' },
  { id: 'sephora', name: 'Sephora', logo: '/stores/sephora.svg', price: 390, available: true, url: 'https://www.sephora.sa' },
  { id: 'faces', name: 'Faces', logo: '/stores/faces.svg', price: 399, available: true, url: 'https://www.faces.com' },
  { id: 'namshi', name: 'Namshi', logo: '/stores/namshi.svg', price: 410, available: true, url: 'https://www.namshi.com' },
  { id: 'selfridges', name: 'Selfridges', logo: '/stores/selfridges.svg', price: 420, available: true, url: 'https://www.selfridges.com' },
  { id: 'ounass', name: 'Ounass', logo: '/stores/ounass.svg', price: 450, available: false, url: 'https://www.ounass.sa' },
  { id: 'beautyglam', name: 'Beauty Glam', logo: '/stores/beautyglam.svg', price: 460, available: true, url: 'https://www.beautyglam.sa' },
  { id: 'perfumesa', name: 'Perfume SA', logo: '/stores/perfumesa.svg', price: 485, available: true, url: 'https://www.perfumesa.com' }
]
*/

const FREE_VISIBLE_STORES = 2

// Convenience search links shown in fallback states.
// Domains are drawn directly from the project's trusted store list (verified in DB).
// Search path follows the standard /en/search?q= convention for each platform.
const FALLBACK_STORES = [
  { name: 'Golden Scent', searchBase: 'https://www.goldenscent.com/en/search?q=' },
  { name: 'FACES',        searchBase: 'https://www.faces.sa/en/search?q=' },
  { name: 'Nice One',     searchBase: 'https://www.niceonesa.com/ar/search?q=' },
] as const

function StoreLogo ({ name, logo }: { name: string; logo: string }) {
  const [imgError, setImgError] = useState(false)
  if (imgError || !logo) {
    return (
      <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-bold text-primary dark:text-amber-500">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }
  return (
    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-surface-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
      <Image
        src={logo}
        alt={name}
        width={32}
        height={32}
        className="w-8 h-8 object-contain"
        loading="lazy"
        onError={() => setImgError(true)}
      />
    </div>
  )
}

function StoreRow ({
  store,
  bestPrice,
  t,
  locale
}: {
  store: StorePrice
  bestPrice: number
  t: (key: string, values?: Record<string, string>) => string
  locale: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-2xl border transition',
        store.price === bestPrice
          ? 'border-primary/30 dark:border-amber-500/30 bg-primary/5 dark:bg-amber-500/10'
          : 'border-gray-100 dark:border-slate-600 bg-white dark:bg-slate-800',
        !store.available && 'opacity-60'
      )}
    >
      <StoreLogo name={store.name} logo={store.logo} />
      <div className="flex-1 min-w-0 text-start">
        <p className="text-sm font-bold text-text-primary dark:text-text-primary">{store.name}</p>
        {store.discountCode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              void navigator.clipboard.writeText(store.discountCode!)
            }}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full mt-0.5 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition"
            title={t('copyCode')}
          >
            🏷️ {store.discountCode}
            {store.discountLabel && (
              <span className="text-amber-600/70 dark:text-amber-500/70">— {store.discountLabel}</span>
            )}
          </button>
        )}
        {store.discountCode && store.discountExpiry && (() => {
          const expiry = new Date(store.discountExpiry)
          const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86_400_000)
          if (daysLeft < 0) return null
          return (
            <p className="text-[10px] mt-0.5 text-gray-500 dark:text-gray-400">
              {daysLeft <= 7
                ? t('expiresSoon')
                : `${t('expiresOn')} ${expiry.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}`}
            </p>
          )
        })()}
        <p className={cn('text-xs', store.available ? 'text-safe-green' : 'text-red-400')}>
          {store.available ? t('available') : t('outOfStock')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {store.price === bestPrice && (
          <span className="text-[10px] font-bold text-safe-green bg-safe-green/10 dark:bg-green-500/20 px-1.5 py-0.5 rounded-full">
            {t('bestPrice')}
          </span>
        )}
        <span className="text-lg font-black text-gray-900 dark:text-slate-100 whitespace-nowrap">
          {store.currency} {store.price}
        </span>
      </div>
      <a
        href={store.available ? store.url : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition',
          store.available
            ? 'bg-text-primary dark:bg-white hover:opacity-80 cursor-pointer text-white dark:text-surface'
            : 'bg-gray-200 dark:bg-surface-muted cursor-not-allowed text-gray-400'
        )}
        aria-label={store.available ? `${t('goToStore', { store: store.name })}` : t('outOfStock')}
        onClick={store.available ? undefined : (e) => e.preventDefault()}
      >
        <ChevronLeft
          className={cn(
            'w-4 h-4',
            store.available ? 'text-white dark:text-surface' : 'text-gray-400'
          )}
        />
      </a>
    </div>
  )
}

function PriceFallbackBlock ({
  status,
  perfumeName,
  perfumeBrand,
  t,
}: {
  status: 'not_indexed' | 'no_prices'
  perfumeName: string
  perfumeBrand: string
  t: (key: string) => string
}) {
  const searchQuery = encodeURIComponent(`${perfumeBrand} ${perfumeName}`)
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 space-y-3">
      <div>
        <p className="text-sm font-bold text-text-primary dark:text-text-primary">
          {status === 'not_indexed' ? t('notIndexedTitle') : t('noPricesTitle')}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {status === 'not_indexed' ? t('notIndexedBody') : t('noPricesBody')}
        </p>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          {t('searchDirectly')}
        </p>
        <div className="space-y-2">
          {FALLBACK_STORES.map((store) => (
            <a
              key={store.name}
              href={`${store.searchBase}${searchQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm font-medium text-amber-700 dark:text-amber-400 hover:border-amber-200 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition"
            >
              <span>{store.name}</span>
              <ChevronLeft className="w-4 h-4 opacity-60" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function PriceHubContent ({
  perfume,
  tier,
  onClose,
  t,
  locale
}: {
  perfume: ScoredPerfume
  tier?: 'GUEST' | 'FREE' | 'PREMIUM'
  onClose: () => void
  t: (key: string, values?: Record<string, string>) => string
  locale: string
}) {
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [fetchedStores, setFetchedStores] = useState<StorePrice[]>([])
  const [pricesStatus, setPricesStatus] = useState<'not_indexed' | 'no_prices' | 'available' | null>(null)

  // sortedStores feeds BOTH rendering AND gating/blur logic
  const sortedStores = useMemo<StorePrice[]>(
    () => [...fetchedStores].sort((a, b) => a.price - b.price),
    [fetchedStores]
  )

  const hubPerfume = perfume as PriceHubPerfume
  const fragellaId = hubPerfume.fragellaId

  useEffect(() => {
    if (!fragellaId) {
      setFetchedStores([])
      setPricesStatus(null)
      setIsLoadingPrices(false)
      return
    }

    setIsLoadingPrices(true)
    setFetchedStores([])
    setPricesStatus(null)

    type StorePricesApiStore = {
      name: string
      slug: string
      price: number
      currency: string
      url: string
      discountCode: string | null
      discountLabel: string | null
      discountExpiry: string | null
      logoUrl: string | null
    }

    type StorePricesApiResponse = {
      stores?: StorePricesApiStore[]
      meta?: {
        fragellaSlug: string
        count: number
        lastUpdated: string | null
        status: 'not_indexed' | 'no_prices' | 'available'
      }
    }

    fetch(`/api/store-prices?fragellaSlug=${encodeURIComponent(fragellaId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StorePricesApiResponse | null) => {
        const status = data?.meta?.status ?? null
        setPricesStatus(status)
        if (status === 'available' && data?.stores?.length) {
          setFetchedStores(
            data.stores.map((s) => ({
              id: s.slug,
              name: s.name,
              logo: s.logoUrl || '',
              price: s.price,
              currency: s.currency || 'SAR',
              available: true,
              url: s.url,
              discountCode: s.discountCode ?? null,
              discountLabel: s.discountLabel ?? null,
              discountExpiry: s.discountExpiry ?? null,
            }))
          )
        } else {
          setFetchedStores([])
        }
      })
      .catch((err) => {
        console.warn('[PriceHub] Failed to fetch store prices:', err)
        setFetchedStores([])
      })
      .finally(() => setIsLoadingPrices(false))
  }, [fragellaId])

  const fragellaPrice = hubPerfume.price ? Number(hubPerfume.price) : 0
  const localBestPrice = sortedStores.length > 0 ? sortedStores[0].price : null
  const bestPrice = localBestPrice ?? fragellaPrice
  const isPremium = tier === 'PREMIUM'

  const localBestForRows = sortedStores.length > 0 ? sortedStores[0].price : 0

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Sticky Header (Mode B only) */}
      {perfume && (
        <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 px-6 py-4 border-b border-primary/5 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl bg-cream-bg dark:bg-background p-2 flex-shrink-0 overflow-hidden">
              <Image
                src={perfume.image || '/placeholder-perfume.svg'}
                alt={perfume.name}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                unoptimized={perfume.image?.startsWith('http') ?? false}
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-perfume.svg' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-text-primary dark:text-text-primary truncate">
                {perfume.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{perfume.brand}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-primary/5 dark:hover:bg-surface-elevated transition flex-shrink-0"
              aria-label={t('close')}
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      )}

      {/* Title section */}
      <div className="px-6 py-3 bg-primary/5 dark:bg-amber-500/5 flex-shrink-0">
        <h3 className="text-sm font-bold text-text-primary dark:text-text-primary">
          {t('priceHubTitle')}
        </h3>
      </div>

      {/* Store rows */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        <div className="space-y-4">
          {isLoadingPrices && (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-slate-800" />
              ))}
            </div>
          )}

          {!isLoadingPrices && sortedStores.length > 0 && (
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {t('localStores')}
              </p>
              <div className="space-y-3">
                {sortedStores
                  .slice(0, isPremium ? sortedStores.length : FREE_VISIBLE_STORES)
                  .map((store) => (
                    <StoreRow
                      key={store.id}
                      store={store}
                      bestPrice={localBestForRows}
                      t={t}
                      locale={locale}
                    />
                  ))}
              </div>
            </div>
          )}

          {!isLoadingPrices && sortedStores.length > 0 && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-2">
              {t('pricesDisclaimer')}
            </p>
          )}

          {!isLoadingPrices && (pricesStatus === 'not_indexed' || pricesStatus === 'no_prices') && (
            <PriceFallbackBlock
              status={pricesStatus}
              perfumeName={hubPerfume.name}
              perfumeBrand={hubPerfume.brand}
              t={t}
            />
          )}

          <div className="mt-4">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {t('referencePrice')}
            </p>
            {hubPerfume.price ? (
              <div
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      السعر التقريبي
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      المصدر: Fragella
                    </p>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ${hubPerfume.price}
                  </p>
                </div>

                {hubPerfume.purchaseUrl && (
                  <a
                    href={hubPerfume.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block w-full text-center py-2.5 rounded-xl bg-amber-700 text-white font-medium hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 transition shadow-sm"
                  >
                    🛒 اشتري الآن
                  </a>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">لا تتوفر معلومات سعر حالياً</p>
              </div>
            )}
          </div>
        </div>

        {/* FREE: Blurred stores + GatingOverlay (Crown + upgrade CTA) */}
        {!isPremium && sortedStores.length > FREE_VISIBLE_STORES && (
          <div className="relative group">
            {/* Blurred content */}
            <div className="filter blur-[8px] opacity-50 pointer-events-none select-none space-y-3">
              {sortedStores.slice(FREE_VISIBLE_STORES).map((store, i) => (
                <div
                  key={`${store.id}-${i}`}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 dark:border-border-subtle"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-surface-muted" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-3 w-16 bg-gray-50 rounded mt-1" />
                  </div>
                  <div className="h-5 w-20 bg-gray-100 rounded" />
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                </div>
              ))}
            </div>

            {/* Gating overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/90 to-black/10 dark:from-black/60 dark:to-black/80 backdrop-blur-md">
              <div className="bg-white dark:bg-surface rounded-2xl shadow-elevation-2 dark:shadow-black/30 p-6 text-center max-w-xs border border-primary/10 dark:border-border-subtle">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 dark:bg-amber-500/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary dark:text-amber-500" />
                </div>
                <div
                  className="p-4 mt-4 text-center rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    🔔 قريباً: مقارنة أسعار من متاجر متعددة
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer: PriceAlertButton (PREMIUM only) or Close */}
      <div className="px-6 py-4 border-t border-primary/10 dark:border-border-subtle flex-shrink-0 space-y-3">
        {isPremium && bestPrice > 0 && tier && (
          <PriceAlertButton
            perfumeId={perfume.id}
            perfumeName={perfume.name}
            currentPrice={bestPrice}
            tier={tier}
          />
        )}
        <Button variant="outline" className="w-full" onClick={onClose}>
          {t('close')}
        </Button>
      </div>
    </div>
  )
}

function ProductCompareContent({
  perfumes,
  locale
}: {
  perfumes: ScoredPerfume[]
  locale: string
}) {
  const t = useTranslations('results.compare')
  const isRtl = locale === 'ar'

  if (!perfumes?.length) return null

  return (
    <div className="space-y-6">
      {/* Thumbnails row */}
      <div className="flex flex-wrap gap-3 justify-center">
        {perfumes.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-2 w-20 shrink-0"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-bg dark:bg-background border border-primary/10 dark:border-border-subtle">
              <Image
                src={p.image || '/placeholder-perfume.svg'}
                alt={p.name}
                fill
                className="object-contain p-1"
                sizes="64px"
                unoptimized={p.image?.startsWith('http') ?? false}
              />
            </div>
            <p className="text-xs font-medium text-text-primary dark:text-text-primary text-center line-clamp-2 leading-tight">
              {p.name}
            </p>
          </div>
        ))}
      </div>

      {/* Row 1: Match Score */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {t('matchLabel')}
        </p>
        <div className="flex flex-wrap gap-2">
          {perfumes.map((p) => (
            <span
              key={p.id}
              className={cn(
                'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold',
                p.finalScore >= 85
                  ? 'bg-safe-green/20 dark:bg-green-500/20 text-safe-green dark:text-green-400'
                  : p.finalScore >= 65
                    ? 'bg-warning-amber/20 dark:bg-amber-500/20 text-warning-amber dark:text-amber-400'
                    : 'bg-danger-red/20 dark:bg-red-500/20 text-danger-red dark:text-red-400'
              )}
            >
              {p.name}: {Math.round(p.finalScore)}%
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: Safe / Warning */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {t('safeLabel')} / {t('warningLabel')}
        </p>
        <div className="flex flex-wrap gap-2">
          {perfumes.map((p) => (
            <span
              key={p.id}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium',
                p.isSafe
                  ? 'bg-safe-green/20 dark:bg-green-500/20 text-safe-green dark:text-green-400'
                  : 'bg-warning-amber/20 dark:bg-amber-500/20 text-warning-amber dark:text-amber-400'
              )}
            >
              {p.isSafe ? (
                <ShieldCheck className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              {p.name}: {p.isSafe ? t('safeLabel') : t('warningLabel')}
            </span>
          ))}
        </div>
      </div>

      {/* Row 3: Fragrance Families */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {t('familiesLabel')}
        </p>
        <div className="space-y-2">
          {perfumes.map((p) => (
            <div key={p.id} className="flex flex-wrap gap-1.5">
              <span className="text-sm font-medium text-text-primary dark:text-text-primary shrink-0">
                {p.name}:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {p.families?.length
                  ? p.families.join(', ')
                  : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Key Ingredients */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          {t('ingredientsLabel')}
        </p>
        <div className="space-y-2">
          {perfumes.map((p) => (
            <div key={p.id} className="flex flex-wrap gap-1.5">
              <span className="text-sm font-medium text-text-primary dark:text-text-primary shrink-0">
                {p.name}:
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {p.ingredients?.length
                  ? p.ingredients.slice(0, 5).join(', ') +
                    (p.ingredients.length > 5 ? '…' : '')
                  : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CompareBottomSheet({
  isOpen,
  onClose,
  mode,
  perfumes,
  perfume,
  tier,
  locale
}: CompareBottomSheetProps) {
  const t = useTranslations('results.compare')
  const isRtl = locale === 'ar'

  const showCompareContent = mode === 'compare' && perfumes && perfumes.length >= 2
  const showPriceHubContent = mode === 'price-hub' && perfume
  const showPlaceholder = mode === 'price-hub' && !perfume

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          {/* Sheet panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-2xl max-h-[85vh] overflow-hidden bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col border-t border-slate-700 sm:border-t-0"
          >
            {/* Mode A: generic header + content + footer */}
            {!showPriceHubContent && (
              <>
                <div className="w-10 h-1 bg-border-subtle rounded-full mx-auto mt-3 mb-4 sm:hidden flex-shrink-0" />
                <div className="px-6 pb-4 flex-shrink-0">
                  <h3 className="text-lg font-bold text-text-primary dark:text-text-primary">
                    {t('sheetTitle')}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                  {showCompareContent && (
                    <ProductCompareContent perfumes={perfumes!} locale={locale} />
                  )}
                  {showPlaceholder && (
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {t('comingSoon')}
                    </p>
                  )}
                </div>
                <div className="px-6 py-4 border-t border-primary/10 dark:border-border-subtle flex-shrink-0">
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    {t('close')}
                  </Button>
                </div>
              </>
            )}
            {/* Mode B: PriceHubContent (own sticky header + body + footer) */}
            {showPriceHubContent && perfume && (
              <>
                <div className="w-10 h-1 bg-border-subtle rounded-full mx-auto mt-3 sm:hidden flex-shrink-0" />
                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <PriceHubContent
                    perfume={perfume}
                    tier={tier}
                    onClose={onClose}
                    t={t}
                    locale={locale}
                  />
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
