'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

// ─── Types ───────────────────────────────────────────────────

interface VaultData {
  isPremium: boolean
  vault: { activeCount: number; diversityScore: number | null } | null
}

type VaultState = 'locked' | 'empty' | 'collecting' | 'map_ready' | 'diversity_visible'

// ─── State helpers ────────────────────────────────────────────

function getVaultState(data: VaultData | null): VaultState {
  if (!data || !data.isPremium)                            return 'locked'
  if (!data.vault || data.vault.activeCount === 0)         return 'empty'
  if (data.vault.activeCount <= 2)                         return 'collecting'
  if (data.vault.activeCount <= 4)                         return 'map_ready'
  return 'diversity_visible'
}

function getStatusText(
  state:   VaultState,
  data:    VaultData | null,
  t:       ReturnType<typeof useTranslations>,
): string {
  const count = data?.vault?.activeCount ?? 0
  const score = data?.vault?.diversityScore ?? 0

  switch (state) {
    case 'locked':
      return t('states.locked')
    case 'empty':
      return t('states.empty')
    case 'collecting':
      return `${t('counts.few', { count })} — ${t('states.addToUnlock', { remaining: 3 - count })}`
    case 'map_ready':
      return `${t('counts.few', { count })} — ${t('states.mapReady')}`
    case 'diversity_visible':
      return `${t('counts.other', { count })} — ${t('states.diversityScore', { score })}`
  }
}

// ─── Component ────────────────────────────────────────────────

export function VaultEntryCard() {
  const t       = useTranslations('vault')
  const router  = useRouter()

  const [data,    setData]    = useState<VaultData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/vault')
      .then(res => res.json())
      .then((json: VaultData) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const state      = getVaultState(data)
  const statusText = getStatusText(state, data, t)
  const isLocked   = state === 'locked'

  function handleClick() {
    if (isLocked) {
      router.push('/pricing')
      return
    }
    // TODO V1: عند ربط المكوّن بصفحة profile، يمكن إضافة router.push('/vault') بعد إنشاء صفحة الخزنة
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      className={[
        'w-full flex items-start gap-4 p-4 rounded-2xl text-right',
        'bg-white dark:bg-zinc-900',
        'border border-primary/10 dark:border-border-subtle',
        'transition-opacity',
        loading ? 'opacity-60 cursor-default' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
        <Layers className="w-5 h-5 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center justify-end gap-2 mb-0.5">
          {isLocked && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary text-white">
              {t('premiumBadge')}
            </span>
          )}
          <p className="text-sm font-bold text-[#0EA5A4] leading-tight">
            {t('title')}
          </p>
        </div>

        <p className="text-xs text-[#0EA5A4] leading-snug mb-1">
          {t('description')}
        </p>

        {!loading && (
          <p className="text-xs font-medium text-[#0EA5A4]">
            {statusText}
          </p>
        )}
      </div>
    </motion.button>
  )
}
