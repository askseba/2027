/**
 * prisma/backfill-slugs.ts
 * Phase B — Step 1: Backfill Perfume.fragellaSlug for all records where it is null.
 *
 * Canonical slug formula (from convertSimilarToScoredPerfume in match/route.ts):
 *   `${brand}-${name}`.toLowerCase()
 *     .replace(/[^a-z0-9\s-]/g, '')
 *     .replace(/\s+/g, '-')
 *     .replace(/-+/g, '-')
 *
 * Run: npx tsx prisma/backfill-slugs.ts
 * Requires: DATABASE_URL env var pointing to a reachable PostgreSQL instance.
 * Safe to re-run: updates only null records, skips conflicts.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function buildFragellaSlug(brand: string, name: string): string {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function main() {
  console.log('[backfill] Starting fragellaSlug backfill...\n')

  // === Phase A verification closure — DO NOT SKIP ===
  const sample = await prisma.perfume.findMany({
    take: 20,
    select: { id: true, name: true, brand: true, fragellaSlug: true }
  })
  console.log('[backfill] DB sample BEFORE any writes:')
  console.log(JSON.stringify(sample, null, 2))

  const nullCount = sample.filter(p => p.fragellaSlug === null).length
  const nonNullCount = sample.filter(p => p.fragellaSlug !== null).length
  console.log(`[backfill] ${nullCount}/${sample.length} have null fragellaSlug`)
  console.log(`[backfill] ${nonNullCount}/${sample.length} already have fragellaSlug`)

  if (nonNullCount > 0) {
    console.log('[backfill] WARNING: Some perfumes already have fragellaSlug values:')
    const existing = sample.filter(p => p.fragellaSlug !== null)
    for (const p of existing) {
      const expected = buildFragellaSlug(p.brand, p.name)
      const matches = p.fragellaSlug === expected
      console.log(
        `  - ${p.name} (${p.brand}): fragellaSlug="${p.fragellaSlug}" expected="${expected}" ${matches ? '✅' : '❌ MISMATCH'}`
      )
      if (!matches) {
        console.error('[backfill] BLOCKER: Existing fragellaSlug does not match canonical formula. STOP.')
        process.exit(1)
      }
    }
    console.log('[backfill] All existing values match canonical formula. Will skip them (update only nulls).')
  }

  if (nullCount === 0) {
    console.log('[backfill] All sampled perfumes already have fragellaSlug — nothing to do.')
    process.exit(0)
  }
  // === End Phase A verification closure ===

  // Fetch ALL perfumes where fragellaSlug is null
  const allNull = await prisma.perfume.findMany({
    where: { fragellaSlug: null },
    select: { id: true, name: true, brand: true }
  })
  console.log(`\n[backfill] Total perfumes with null fragellaSlug: ${allNull.length}`)

  // Pre-fetch all existing (non-null) slugs to detect collisions before writing
  const existingSlugs = new Set(
    (await prisma.perfume.findMany({
      where: { fragellaSlug: { not: null } },
      select: { fragellaSlug: true }
    })).map(p => p.fragellaSlug as string)
  )

  const stats = {
    scanned: allNull.length,
    updated: 0,
    skippedExisting: 0,   // already had a slug (shouldn't occur here — we filtered)
    skippedConflict: 0,   // would collide with an already-set slug
    errors: 0
  }

  // Also track slugs we are about to write in this run (to detect intra-batch duplicates)
  const pendingSlugs = new Set<string>()

  for (const perfume of allNull) {
    const slug = buildFragellaSlug(perfume.brand, perfume.name)

    if (existingSlugs.has(slug) || pendingSlugs.has(slug)) {
      console.warn(
        `[backfill] CONFLICT — skipping id=${perfume.id} "${perfume.brand} ${perfume.name}": slug="${slug}" already exists`
      )
      stats.skippedConflict++
      continue
    }

    try {
      await prisma.perfume.update({
        where: { id: perfume.id },
        data: { fragellaSlug: slug }
      })
      pendingSlugs.add(slug)
      console.log(`[backfill] Updated id=${perfume.id} "${perfume.brand} ${perfume.name}" → "${slug}"`)
      stats.updated++
    } catch (err: any) {
      if (err?.code === 'P2002') {
        // Unique constraint race — treat as conflict
        console.warn(`[backfill] UNIQUE CONFLICT on id=${perfume.id} slug="${slug}" — skipping`)
        stats.skippedConflict++
      } else {
        console.error(`[backfill] ERROR on id=${perfume.id}:`, err?.message ?? err)
        stats.errors++
      }
    }
  }

  console.log('\n[backfill] === Final Stats ===')
  console.log(`  scanned:         ${stats.scanned}`)
  console.log(`  updated:         ${stats.updated}`)
  console.log(`  skippedExisting: ${stats.skippedExisting}`)
  console.log(`  skippedConflict: ${stats.skippedConflict}`)
  console.log(`  errors:          ${stats.errors}`)
  console.log('[backfill] Done.')
}

main()
  .catch((e) => { console.error('[backfill] Fatal error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
