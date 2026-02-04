'use client'
import React from 'react'
import { Lock } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface BlurredItem {
  name: string
  brand: string
  matchScore: number
}

// Support both old and new interfaces
interface BlurredTeaserCardProps {
  // New interface (single card)
  title?: string
  brand?: string
  matchPercentage?: number
  matchRange?: string // Added for Bonus Prompt
  // Old interface (multiple items)
  items?: BlurredItem[]
  tier?: 'GUEST' | 'FREE'
  userTier?: 'guest' | 'free' | 'premium' // Added for Bonus Prompt
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
  
  // Handle old interface (items array)
  if (items && items.length > 0) {
    const averageMatch = Math.round(
      items.reduce((sum, i) => sum + i.matchScore, 0) / items.length
    )
    
    const currentTier = userTier?.toUpperCase() || tier || 'GUEST'
    const message = currentTier === 'GUEST' 
      ? 'سجّل مجاناً لحفظ بصمتك العطرية'
      : 'اشترك للوصول لجميع النتائج'
    
    const ctaText = currentTier === 'GUEST'
      ? 'سجّل الآن مجاناً'
      : 'اشترك بـ 15 ريال/شهر'
    
    const handleClick = () => {
      if (tier === 'GUEST') {
        signIn()
      } else {
        onUpgrade?.() || router.push('/pricing')
      }
    }
    
    return (
      <div className="relative bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/10 dark:from-amber-500/10 dark:via-purple-500/10 dark:to-amber-500/10 rounded-3xl p-8 border-2 border-primary/20 dark:border-border-subtle overflow-hidden" dir="rtl">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/40 dark:bg-black/70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 dark:bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-primary to-purple-600 dark:from-amber-600 dark:to-purple-700 p-6 rounded-full shadow-2xl">
              <Lock className="w-12 h-12 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="relative z-20 text-center space-y-6">
          <div className="flex justify-center gap-4 mb-6">
            {items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-surface/80 backdrop-blur-sm rounded-xl p-3 border border-primary/10 dark:border-border-subtle">
                <p className="text-xs text-brown-text/60 dark:text-text-muted mb-1">{item.brand}</p>
                <p className="text-sm font-bold text-brown-text dark:text-text-primary truncate w-20">{item.name}</p>
                <p className="text-xs text-primary dark:text-amber-500 font-bold mt-1">{item.matchScore}%</p>
              </div>
            ))}
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-brown-text dark:text-text-primary">
            {items.length} عطر إضافي ينتظرك
          </h3>
          <p className="text-lg text-brown-text/75 dark:text-text-muted">{message}</p>
          <p className="text-3xl font-black text-primary dark:text-amber-500">{matchRange || `${averageMatch}%`}</p>
          <p className="text-sm text-brown-text/60 dark:text-text-muted">متوسط التطابق</p>
          <button
            onClick={handleClick}
            className="w-full py-4 px-8 bg-gradient-to-l from-primary to-amber-500 dark:from-amber-600 dark:to-amber-700 hover:from-primary/90 hover:to-amber-600 dark:hover:from-amber-500 dark:hover:to-amber-600 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-primary/50 dark:hover:shadow-amber-900/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {ctaText}
          </button>
        </div>
      </div>
    )
  }
  
  // New interface (single card)
  return (
    <div className="w-full max-w-sm bg-cream-bg dark:bg-surface rounded-2xl shadow-lg overflow-hidden border border-brown-text/5 dark:border-border-subtle">
      <div className="relative w-full aspect-[4/5] flex items-center justify-center p-8 mt-2 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-amber-500/20 dark:to-amber-500/10">
        <div className="absolute inset-0 backdrop-blur-md bg-black/20 dark:bg-black/40" />
        <Lock className="w-16 h-16 text-white/70 relative z-10" />
      </div>
      <div className="relative px-6 pb-6 pt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            🔒 مموّه
          </span>
          <span className="text-brand-gold-darker dark:text-amber-500 text-sm font-bold">{brand}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-brown-text/10 dark:bg-surface-muted rounded-lg w-3/4 animate-pulse" />
          <div className="h-4 bg-brown-text/10 dark:bg-surface-muted rounded-lg w-full animate-pulse" />
        </div>
        <div className="h-px w-full bg-brown-text/10 dark:bg-white/10" />
        <button 
          onClick={() => {
            if (!tier || tier === 'GUEST') {
              signIn()
            } else {
              router.push('/pricing')
            }
          }}
          className="w-full min-touch-target rounded-full font-bold text-base bg-primary dark:bg-amber-600 hover:bg-primary/90 dark:hover:bg-amber-700 text-white transition-all"
        >
          اشترك لرؤية النتيجة
        </button>
      </div>
    </div>
  )
}
