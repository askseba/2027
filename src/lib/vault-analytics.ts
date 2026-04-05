import { VaultPerfume, VaultPerfumeStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { translateFamily, translateNote } from '@/lib/utils/family'

// ─── Constants ───────────────────────────────────────────────

export const VAULT_TIERS = {
  LIST:             0,
  MAP:              3,
  FRAGRANCE_LINES:  5,
  GAPS:             5,
} as const

const MAIN_FAMILIES = ['woody', 'oriental', 'fresh', 'floral', 'citrus', 'aquatic'] as const

const WARMTH_VALUES: Record<string, number> = {
  oriental:  100,
  amber:      95,
  spicy:      90,
  leather:    85,
  woody:      75,
  tobacco:    70,
  gourmand:   65,
  vanilla:    60,
  floral:     50,
  aromatic:   45,
  chypre:     40,
  green:      30,
  fruity:     25,
  citrus:     20,
  aquatic:    15,
  fresh:      10,
}

const FAMILY_ICON: Record<string, string> = {
  woody:    '🪵',
  oriental: '🕌',
  fresh:    '🌿',
  floral:   '🌸',
  citrus:   '🍋',
  aquatic:  '🌊',
}

// ─── Interfaces ──────────────────────────────────────────────

export interface FamilyDistributionItem {
  family:    string
  familyAr:  string
  percentage: number
  count:     number
}

export interface TopNoteItem {
  note:   string
  noteAr: string
  count:  number
}

export interface FragranceLine {
  name:          string
  nameAr:        string
  family:        string
  sharedNotes:   string[]
  sharedNotesAr: string[]
  perfumes:      string[]
  count:         number
  message:       string
}

export interface GapItem {
  type:    'weight' | 'family'
  icon:    string
  message: string
}

// ─── Core recalculation ──────────────────────────────────────

export async function recalculateVaultAnalytics(vaultId: string): Promise<void> {
  const perfumes = await prisma.vaultPerfume.findMany({
    where: { vaultId, status: VaultPerfumeStatus.ACTIVE },
  })

  const analyzable = perfumes.filter(p => p.family !== 'unknown')
  const activeCount = perfumes.length

  let diversityScore: number | null = null
  if (analyzable.length >= VAULT_TIERS.GAPS) {
    const distribution = calculateFamilyDistribution(analyzable)
    const result = calculateDiversityScore(distribution, activeCount)
    diversityScore = result.score
  }

  await prisma.userVault.update({
    where: { id: vaultId },
    data:  { activeCount, diversityScore },
  })
}

// ─── Family distribution ─────────────────────────────────────

export function calculateFamilyDistribution(
  perfumes: VaultPerfume[],
): FamilyDistributionItem[] {
  const counts = new Map<string, number>()

  for (const p of perfumes) {
    if (p.family === 'unknown') continue
    counts.set(p.family, (counts.get(p.family) ?? 0) + 1)
  }

  const total = Array.from(counts.values()).reduce((sum, n) => sum + n, 0)
  if (total === 0) return []

  return Array.from(counts.entries())
    .map(([family, count]) => ({
      family,
      familyAr:   translateFamily(family),
      percentage: Math.round((count / total) * 100),
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

// ─── Diversity score ─────────────────────────────────────────

export function calculateDiversityScore(
  distribution: FamilyDistributionItem[],
  activeCount:  number,
): { score: number; reason: string } {
  if (activeCount < 5 || distribution.length === 0) {
    return { score: 0, reason: 'أضف المزيد من العطور' }
  }

  const uniqueFamilies       = distribution.length
  const dominantPercentage   = distribution[0].percentage   // sorted descending
  const familyScore          = Math.min(uniqueFamilies * 2, 10)
  const concentrationPenalty = dominantPercentage > 50
    ? Math.floor((dominantPercentage - 50) / 10)
    : 0

  const score = Math.max(1, Math.min(10, familyScore - concentrationPenalty))

  let reason: string
  if (score >= 8) {
    reason = 'تنوع ممتاز في العائلات العطرية'
  } else if (score >= 6) {
    reason = 'تنوع جيد مع إمكانية التوسع'
  } else if (concentrationPenalty > 0) {
    reason = `تركيز عالٍ على عائلة ${distribution[0].familyAr}`
  } else {
    reason = 'أضف عطوراً من عائلات مختلفة لرفع التنوع'
  }

  return { score, reason }
}

// ─── Top notes ───────────────────────────────────────────────

export function calculateTopNotes(perfumes: VaultPerfume[], limit = 5): TopNoteItem[] {
  const counts = new Map<string, number>()

  for (const p of perfumes) {
    for (const note of [...p.notesHeart, ...p.notesBase]) {
      if (!note) continue
      const key = note.toLowerCase().trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .map(([note, count]) => ({
      note,
      noteAr: translateNote(note),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

// ─── Fragrance lines ─────────────────────────────────────────

export function calculateFragranceLines(perfumes: VaultPerfume[]): FragranceLine[] {
  const groups = new Map<string, VaultPerfume[]>()

  for (const p of perfumes) {
    if (p.family === 'unknown') continue
    const arr = groups.get(p.family) ?? []
    arr.push(p)
    groups.set(p.family, arr)
  }

  const lines: FragranceLine[] = []

  for (const [family, group] of groups.entries()) {
    if (group.length < 2) continue

    const noteSets = group.map(
      p => new Set([...p.notesHeart, ...p.notesBase].map(n => n.toLowerCase().trim())),
    )

    const sharedNotes = Array.from(noteSets[0]).filter(
      note => noteSets.every(set => set.has(note)),
    )

    if (sharedNotes.length === 0) continue

    const familyAr        = translateFamily(family)
    const sharedNotesAr   = sharedNotes.map(translateNote)

    lines.push({
      name:         `${family} line`,
      nameAr:       `خط ${familyAr}`,
      family,
      sharedNotes,
      sharedNotesAr,
      perfumes:     group.map(p => p.name),
      count:        group.length,
      message:      `${group.length} عطور تشترك في ${sharedNotes.length} نوتة`,
    })
  }

  return lines
}

// ─── Gaps ────────────────────────────────────────────────────

export function calculateGaps(
  perfumes:     VaultPerfume[],
  distribution: FamilyDistributionItem[],
): GapItem[] {
  const gaps: GapItem[]              = []
  const presentFamilies              = new Set(distribution.map(d => d.family))

  for (const family of MAIN_FAMILIES) {
    if (gaps.length >= 3) break
    if (!presentFamilies.has(family)) {
      gaps.push({
        type:    'family',
        icon:    FAMILY_ICON[family] ?? '🌸',
        message: `لا يوجد عطر من عائلة ${translateFamily(family)}`,
      })
    }
  }

  if (gaps.length < 3 && perfumes.length > 0) {
    const warmth = calculateWarmthScale(distribution)
    if (warmth > 70) {
      gaps.push({ type: 'weight', icon: '🔥', message: 'مجموعتك ثقيلة — جرّب عطراً منعشاً' })
    } else if (warmth < 30) {
      gaps.push({ type: 'weight', icon: '❄️', message: 'مجموعتك خفيفة — جرّب عطراً دافئاً' })
    }
  }

  return gaps.slice(0, 3)
}

// ─── Warmth scale ────────────────────────────────────────────

export function calculateWarmthScale(distribution: FamilyDistributionItem[]): number {
  if (distribution.length === 0) return 50

  let weightedSum = 0
  let totalWeight = 0

  for (const item of distribution) {
    const warmth  = WARMTH_VALUES[item.family] ?? 50
    weightedSum  += warmth * item.count
    totalWeight  += item.count
  }

  return totalWeight === 0 ? 50 : Math.round(weightedSum / totalWeight)
}

// ─── Taste description ───────────────────────────────────────

export function generateTasteDescription(distribution: FamilyDistributionItem[]): string {
  if (distribution.length === 0) return 'مجموعة عطرية متنوعة'

  const warmth        = calculateWarmthScale(distribution)
  const warmthLabel   = warmth > 65 ? 'دافئة' : warmth < 35 ? 'منعشة' : 'متوازنة'
  const topFamilies   = distribution.slice(0, 2).map(d => d.familyAr)
  const familyText    = topFamilies.join(' و')
  const intensityLabel = warmth > 70 ? 'ثقيلة' : warmth < 30 ? 'خفيفة' : ''

  return `عطور ${warmthLabel} ${familyText}${intensityLabel ? ' ' + intensityLabel : ''}`.trim()
}
