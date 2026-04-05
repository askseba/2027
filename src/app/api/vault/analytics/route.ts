import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserTierInfo } from '@/lib/gating'
import logger from '@/lib/logger'
import { VaultPerfumeStatus } from '@prisma/client'
import {
  VAULT_TIERS,
  calculateFamilyDistribution,
  calculateTopNotes,
  calculateFragranceLines,
  calculateGaps,
  calculateWarmthScale,
  generateTasteDescription,
} from '@/lib/vault-analytics'

// ─── Tier helpers ────────────────────────────────────────────

type VaultTier = 'empty' | 'collecting' | 'map_ready' | 'full'

function getVaultTier(analyzableCount: number): VaultTier {
  if (analyzableCount === 0) return 'empty'
  if (analyzableCount <= 2) return 'collecting'
  if (analyzableCount <= 4) return 'map_ready'
  return 'full'
}

// ─── GET /api/vault/analytics ────────────────────────────────

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 })
    }

    const userId = session.user.id
    const tierInfo = await getUserTierInfo(userId)
    if (tierInfo.tier !== 'PREMIUM') {
      return NextResponse.json({ error: 'هذه الميزة للمشتركين' }, { status: 403 })
    }

    const vault = await prisma.userVault.findUnique({
      where:   { userId },
      include: {
        perfumes: { where: { status: VaultPerfumeStatus.ACTIVE } },
      },
    })

    if (!vault) {
      return NextResponse.json({
        tier:            'empty',
        activeCount:     0,
        analyzableCount: 0,
        map:             null,
        fragranceLines:  null,
        gaps:            null,
      })
    }

    const activePerfumes     = vault.perfumes
    const activeCount        = activePerfumes.length
    const analyzablePerfumes = activePerfumes.filter(p => p.family !== 'unknown')
    const analyzableCount    = analyzablePerfumes.length
    const tier               = getVaultTier(analyzableCount)

    // Always computed — used in map and gaps regardless of tier
    const familyDistribution = calculateFamilyDistribution(analyzablePerfumes)

    const includeMap  = analyzableCount >= VAULT_TIERS.MAP
    const includeFull = analyzableCount >= VAULT_TIERS.FRAGRANCE_LINES

    const map = includeMap
      ? {
          warmthScale:      calculateWarmthScale(familyDistribution),
          tasteDescription: generateTasteDescription(familyDistribution),
          familyDistribution,
          topNotes:         calculateTopNotes(analyzablePerfumes),
          diversityScore:   vault.diversityScore,
        }
      : null

    const fragranceLines = includeFull
      ? calculateFragranceLines(analyzablePerfumes)
      : null

    const gaps = includeFull
      ? calculateGaps(analyzablePerfumes, familyDistribution)
      : null

    return NextResponse.json({
      tier,
      activeCount,
      analyzableCount,
      map,
      fragranceLines,
      gaps,
    })
  } catch (error) {
    logger.error('[vault/analytics GET]', error)
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 })
  }
}
