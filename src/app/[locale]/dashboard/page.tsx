"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  Heart,
  History,
  Settings,
  Sparkles,
  Zap,
  Clock,
  Loader2,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/ui/BackButton'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const RadarChart = dynamic(
  () => import('@/components/ui/RadarChart').then(mod => ({ default: mod.RadarChart })),
  { ssr: false, loading: () => <div className="aspect-square bg-cream-bg dark:bg-surface-muted animate-pulse rounded-3xl" /> }
)

// ─── Types ─────────────────────────────────────────────────────

type TierData = {
  tier: 'GUEST' | 'FREE' | 'PREMIUM'
  hasActiveSubscription: boolean
}

type TestRecord = {
  id: string
  createdAt: string
  totalMatches: number
  topMatchId: string | null
  topMatchScore: number | null
}

type CatalogPerfume = { id: string; name: string; brand: string; image: string }

type FavoriteItem = {
  id: string
  name: string
  brand: string
  image: string
  resolved: boolean
}

type RadarPoint = { name: string; score: number; color: string }

// ─── Family → chart color ───────────────────────────────────────

const FAMILY_COLORS: Record<string, string> = {
  woody:    'var(--color-warning-amber)',
  oriental: 'var(--color-accent-purple)',
  fresh:    'var(--color-safe-green)',
  floral:   'var(--color-accent-pink)',
  citrus:   'var(--color-google-blue)',
  aquatic:  'var(--color-primary)',
  spicy:    'var(--color-danger-red)',
  amber:    'var(--color-accent-pink)',
}
const FALLBACK_COLORS = [
  'var(--color-safe-green)',
  'var(--color-warning-amber)',
  'var(--color-danger-red)',
  'var(--color-google-blue)',
  'var(--color-accent-purple)',
  'var(--color-accent-pink)',
]

// ─── Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const locale    = useLocale()
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const t         = useTranslations('dashboard')
  const { data: session, status } = useSession()
  const router    = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const [tierData,      setTierData]      = useState<TierData | null>(null)
  const [testHistory,   setTestHistory]   = useState<TestRecord[] | null>(null)
  const [favorites,     setFavorites]     = useState<FavoriteItem[] | null>(null)
  const [radarData,     setRadarData]     = useState<RadarPoint[] | null>(null)

  const [loadingTier,      setLoadingTier]      = useState(true)
  const [loadingHistory,   setLoadingHistory]   = useState(true)
  const [loadingFavorites, setLoadingFavorites] = useState(true)
  const [loadingRadar,     setLoadingRadar]     = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') return

    // Tier — لا نفترض FREE عند فشل الشبكة (لا شارة بدل بيانات كاذبة)
    fetch('/api/user/tier')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d && (d.tier === 'GUEST' || d.tier === 'FREE' || d.tier === 'PREMIUM')) {
          setTierData({
            tier: d.tier,
            hasActiveSubscription: Boolean(d.hasActiveSubscription),
          })
        } else {
          setTierData(null)
        }
      })
      .catch(() => setTierData(null))
      .finally(() => setLoadingTier(false))

    // Test history
    fetch('/api/user/test-history')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setTestHistory(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setTestHistory([]))
      .finally(() => setLoadingHistory(false))

    // Favorites + local catalog for name resolution
    Promise.all([
      fetch('/api/user/favorites').then(r => (r.ok ? r.json() : null)),
      fetch('/api/perfumes').then(r => (r.ok ? r.json() : null)),
    ])
      .then(([favRes, perfumesRes]) => {
        const ids: string[]             = Array.isArray(favRes?.data) ? favRes.data : []
        const catalog: CatalogPerfume[] = Array.isArray(perfumesRes) ? perfumesRes : []
        const map = new Map(catalog.map(p => [p.id, p]))
        const items: FavoriteItem[] = ids.map(id => {
          const p = map.get(id)
          return p
            ? { id, name: p.name, brand: p.brand, image: p.image, resolved: true }
            : { id, name: '', brand: '', image: '', resolved: false }
        })
        setFavorites(items)
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoadingFavorites(false))
  }, [status, locale])

  // Vault analytics → RadarChart: فقط للمشترك PREMIUM (الـ API يرفض غير ذلك)
  useEffect(() => {
    if (status !== 'authenticated') return
    if (loadingTier) return
    if (tierData?.tier !== 'PREMIUM') {
      setRadarData(null)
      setLoadingRadar(false)
      return
    }

    let cancelled = false
    setLoadingRadar(true)
    fetch('/api/vault/analytics')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (cancelled) return
        const dist = d?.map?.familyDistribution
        if (!dist || !Array.isArray(dist) || dist.length === 0) {
          setRadarData(null)
          return
        }
        const points: RadarPoint[] = dist.map(
          (item: { family: string; familyAr: string; percentage: number }, i: number) => ({
            name: item.familyAr,
            score: item.percentage,
            color: FAMILY_COLORS[item.family] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          })
        )
        setRadarData(points)
      })
      .catch(() => {
        if (!cancelled) setRadarData(null)
      })
      .finally(() => {
        if (!cancelled) setLoadingRadar(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, loadingTier, tierData?.tier])

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-cream-bg dark:!bg-surface">
      <LoadingSpinner size="lg" />
    </div>
  )
  if (status === 'unauthenticated') { router.push('/login'); return null }

  const showPremiumBadge = tierData?.tier === 'PREMIUM'

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-cream-bg dark:!bg-surface pb-20" dir={direction}>

        {/* ── Header ── */}
        <header className="bg-white dark:bg-surface border-b border-primary/5 dark:border-border-subtle pt-12 pb-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <BackButton variant="link" className="mb-6" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden shadow-elevation-2 border-4 border-white">
                  <Image
                    src={session?.user?.image || '/placeholder-user.png'}
                    alt={session?.user?.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-text-primary dark:text-text-primary mb-1">
                    أهلاً، {session?.user?.name?.split(' ')[0]} ✨
                  </h1>
                  {!loadingTier && showPremiumBadge && (
                    <span className="bg-primary/10 dark:bg-amber-500/20 text-primary dark:text-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                      بريميوم
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => router.push('/profile')}>
                  <Settings className="w-4 h-4 ml-2" />
                  الإعدادات
                </Button>
                <Button size="sm" className="rounded-xl shadow-button" onClick={() => router.push('/quiz/step1-favorites')}>
                  <Sparkles className="w-4 h-4 ml-2" />
                  تحليل جديد
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-6xl mx-auto px-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left column ── */}
            <div className="lg:col-span-1 space-y-8">

              {/* RadarChart — بيانات map.familyDistribution فقط؛ لا عرض أثناء التحميل أو بدون بيانات */}
              {loadingRadar ? (
                <div className="aspect-square bg-cream-bg dark:bg-surface-muted animate-pulse rounded-3xl border border-primary/5 dark:border-border-subtle" />
              ) : null}
              {!loadingRadar && radarData && radarData.length > 0 && (
                <RadarChart data={radarData} className="shadow-elevation-2" />
              )}

              {/* Quick stats — only real data */}
              <div className="bg-white dark:bg-surface rounded-3xl p-6 shadow-elevation-1 border border-primary/5 dark:border-border-subtle">
                <h3 className="font-bold text-text-primary dark:text-text-primary mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary dark:text-amber-500" />
                  إحصائيات
                </h3>
                {loadingHistory ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-text-secondary dark:text-text-muted" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-cream-bg dark:bg-surface-muted rounded-2xl">
                      <span className="text-sm text-text-secondary dark:text-text-muted">عدد الاختبارات</span>
                      <span className="font-black text-text-primary dark:text-text-primary">
                        {testHistory?.length ?? 0}
                      </span>
                    </div>
                    {testHistory && testHistory.length > 0 && (
                      <div className="flex justify-between items-center p-3 bg-cream-bg dark:bg-surface-muted rounded-2xl">
                        <span className="text-sm text-text-secondary dark:text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          آخر اختبار
                        </span>
                        <span className="font-black text-text-primary dark:text-text-primary text-sm">
                          {new Date(testHistory[0].createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Tab bar */}
              <div className="flex bg-white dark:bg-surface p-1.5 rounded-2xl shadow-sm border border-primary/5 dark:border-border-subtle">
                {[
                  { id: 'overview',  label: 'نظرة عامة', icon: Sparkles },
                  { id: 'favorites', label: 'المفضلة',   icon: Heart    },
                  { id: 'history',   label: 'السجل',     icon: History  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-button'
                        : 'text-text-secondary dark:text-text-muted hover:bg-cream-bg dark:hover:bg-surface-muted'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="min-h-[400px]">

                {/* ── Overview ── */}
                {activeTab === 'overview' && (
                  loadingHistory ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="w-6 h-6 animate-spin text-text-secondary dark:text-text-muted" />
                    </div>
                  ) : testHistory && testHistory.length > 0 ? (
                    <div className="bg-white dark:bg-surface rounded-[2.5rem] p-6 border border-primary/5 dark:border-border-subtle">
                      <h2 className="text-lg font-bold text-text-primary dark:text-text-primary mb-4">
                        آخر اختبار
                      </h2>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-cream-bg dark:bg-surface-muted rounded-2xl">
                          <span className="text-sm text-text-secondary dark:text-text-muted">التاريخ</span>
                          <span className="font-bold text-text-primary dark:text-text-primary text-sm">
                            {new Date(testHistory[0].createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-cream-bg dark:bg-surface-muted rounded-2xl">
                          <span className="text-sm text-text-secondary dark:text-text-muted">عدد النتائج</span>
                          <span className="font-bold text-text-primary dark:text-text-primary text-sm">
                            {testHistory[0].totalMatches}
                          </span>
                        </div>
                        {testHistory[0].topMatchScore !== null && (
                          <div className="flex justify-between items-center p-3 bg-cream-bg dark:bg-surface-muted rounded-2xl">
                            <span className="text-sm text-text-secondary dark:text-text-muted">أعلى تطابق</span>
                            <span className="font-bold text-primary dark:text-amber-500 text-sm">
                              {t('matchFormat', { pct: Math.round(testHistory[0].topMatchScore) })}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button className="w-full mt-4 rounded-xl" onClick={() => router.push('/quiz/step1-favorites')}>
                        <Sparkles className="w-4 h-4 ml-2" />
                        ابدأ تحليلاً جديداً
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white dark:bg-surface rounded-[2.5rem] border border-dashed border-primary/20 dark:border-border-subtle">
                      <div className="bg-primary/10 dark:bg-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-primary dark:text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">لا توجد نتائج بعد</h3>
                      <p className="text-text-secondary dark:text-text-muted text-sm mb-8">أكمل اختباراً ليُحفظ سجلّك ونتائجك هنا</p>
                      <Button onClick={() => router.push('/quiz/step1-favorites')}>ابدأ الاختبار</Button>
                    </div>
                  )
                )}

                {/* ── Favorites ── */}
                {activeTab === 'favorites' && (
                  loadingFavorites ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="w-6 h-6 animate-spin text-text-secondary dark:text-text-muted" />
                    </div>
                  ) : favorites && favorites.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {favorites.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-white dark:bg-surface rounded-2xl border border-primary/5 dark:border-border-subtle shadow-elevation-1">
                          <div className="relative w-16 h-16 flex-shrink-0 bg-cream-bg dark:bg-surface-muted rounded-xl overflow-hidden flex items-center justify-center">
                            {item.resolved && item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-perfume.svg' }}
                              />
                            ) : item.resolved ? (
                              <Image
                                src="/placeholder-perfume.svg"
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Heart className="w-6 h-6 text-text-secondary dark:text-text-muted" aria-hidden />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {item.resolved ? (
                              <>
                                <p className="font-bold text-text-primary dark:text-text-primary truncate">{item.name}</p>
                                {item.brand ? (
                                  <p className="text-sm text-text-secondary dark:text-text-muted truncate">{item.brand}</p>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <p className="font-mono text-sm text-text-primary dark:text-text-primary break-all">
                                  {item.id}
                                </p>
                                <p className="text-xs text-text-secondary dark:text-text-muted mt-0.5">
                                  {locale === 'ar' ? 'غير متوفر في الكتالوج المحلي' : 'Not in local catalog'}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white dark:bg-surface rounded-[2.5rem] border border-dashed border-primary/20 dark:border-border-subtle">
                      <div className="bg-primary/10 dark:bg-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-primary dark:text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">قائمة مفضلاتك فارغة</h3>
                      <p className="text-text-secondary dark:text-text-muted text-sm mb-8">ابدأ باستكشاف العطور وأضف ما يعجبك هنا</p>
                      <Button onClick={() => router.push('/quiz/step1-favorites')}>استكشف العطور الآن</Button>
                    </div>
                  )
                )}

                {/* ── History ── */}
                {activeTab === 'history' && (
                  loadingHistory ? (
                    <div className="flex justify-center py-20">
                      <Loader2 className="w-6 h-6 animate-spin text-text-secondary dark:text-text-muted" />
                    </div>
                  ) : testHistory && testHistory.length > 0 ? (
                    <div className="space-y-4">
                      {testHistory.map((record) => (
                        <div key={record.id} className="bg-white dark:bg-surface p-4 rounded-2xl border border-primary/5 dark:border-border-subtle flex items-center gap-4">
                          <div className="bg-cream-bg dark:bg-surface-muted p-3 rounded-xl flex-shrink-0">
                            <History className="w-5 h-5 text-text-secondary dark:text-text-muted" />
                          </div>
                          <div>
                            <p className="font-bold text-text-primary dark:text-text-primary text-sm">
                              {record.totalMatches} نتيجة
                            </p>
                            <p className="text-[10px] text-text-secondary dark:text-text-muted">
                              {new Date(record.createdAt).toLocaleDateString('ar-SA')}
                              {record.topMatchScore !== null &&
                                ` • ${t('matchFormat', { pct: Math.round(record.topMatchScore) })}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white dark:bg-surface rounded-[2.5rem] border border-dashed border-primary/20 dark:border-border-subtle">
                      <div className="bg-primary/10 dark:bg-amber-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-primary dark:text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">لا يوجد سجل بعد</h3>
                      <p className="text-text-secondary dark:text-text-muted text-sm mb-8">أجرِ اختباراً لتظهر نتائجه هنا</p>
                      <Button onClick={() => router.push('/quiz/step1-favorites')}>ابدأ الاختبار</Button>
                    </div>
                  )
                )}

              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
