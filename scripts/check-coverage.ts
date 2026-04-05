/**
 * scripts/check-coverage.ts
 * Measures actual price coverage matching /api/store-prices filter conditions exactly.
 *
 * Env vars:
 *   COVERAGE_LABEL   label for this snapshot (default: 'current')
 *
 * Run:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/check-coverage.ts
 *   COVERAGE_LABEL=post-sync npx dotenv-cli -e .env.local -- npx tsx scripts/check-coverage.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  console.error('[coverage] DATABASE_URL env var is required')
  process.exit(1)
}

const COVERAGE_LABEL = process.env.COVERAGE_LABEL ?? 'current'

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
const prisma   = new PrismaClient({ adapter } as any)

async function main() {
  console.log(`\n=== [check-coverage] label="${COVERAGE_LABEL}" ===\n`)

  // ── indexed: perfumes with fragellaSlug set ─────────────────────────────────
  const indexed = await prisma.perfume.count({
    where: { fragellaSlug: { not: null } },
  })

  // ── Conditions mirroring /api/store-prices exactly:
  //    isAvailable=true AND listingUrl IS NOT NULL
  //    AND store.isActive=true AND perfume.fragellaSlug IS NOT NULL
  const visibleFilter = {
    isAvailable:  true,
    listingUrl:   { not: null as null },
    store:        { isActive: true },
    perfume:      { fragellaSlug: { not: null as null } },
  }

  // ── withVisiblePrices: distinct perfumeIds that have at least one visible row ─
  const distinctRows = await prisma.price.findMany({
    where:    visibleFilter,
    distinct: ['perfumeId'],
    select:   { perfumeId: true },
  })
  const withVisiblePrices = distinctRows.length

  // ── visiblePriceRows: total visible rows ────────────────────────────────────
  const visiblePriceRows = await prisma.price.count({ where: visibleFilter })

  // ── lastUpdated: most recent Price.updatedAt among visible rows ─────────────
  const latestRow = await prisma.price.findFirst({
    where:   visibleFilter,
    orderBy: { updatedAt: 'desc' },
    select:  { updatedAt: true },
  })
  const lastUpdated = latestRow?.updatedAt?.toISOString() ?? 'none'

  // ── Output ──────────────────────────────────────────────────────────────────
  console.log(`indexed (fragellaSlug set)      : ${indexed}`)
  console.log(`withVisiblePrices (distinct IDs): ${withVisiblePrices}`)
  console.log(`visiblePriceRows (total rows)   : ${visiblePriceRows}`)
  console.log(`lastUpdated                     : ${lastUpdated}`)

  const coveragePct = indexed > 0
    ? ((withVisiblePrices / indexed) * 100).toFixed(1)
    : '0.0'
  console.log(`\ncoverage: ${withVisiblePrices}/${indexed} perfumes (${coveragePct}%)`)

  console.log('\n=== [check-coverage] Done ===\n')
}

main()
  .catch((err) => {
    console.error('[coverage] Fatal error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
