/**
 * scripts/check-baseline.ts
 * Prints a baseline snapshot of the DB state relevant to price sync.
 *
 * Run:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/check-baseline.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  console.error('[baseline] DATABASE_URL env var is required')
  process.exit(1)
}

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
const prisma   = new PrismaClient({ adapter } as any)

async function main() {
  console.log('\n=== [check-baseline] DB Snapshot ===\n')

  // ── Perfume counts ──────────────────────────────────────────────────────────
  const totalPerfumes = await prisma.perfume.count()
  const indexedCount  = await prisma.perfume.count({ where: { fragellaSlug: { not: null } } })
  const nullCount     = await prisma.perfume.count({ where: { fragellaSlug: null } })

  console.log(`Perfumes — total         : ${totalPerfumes}`)
  console.log(`Perfumes — fragellaSlug set (sync scope) : ${indexedCount}`)
  console.log(`Perfumes — fragellaSlug null (ignored)   : ${nullCount}`)

  // ── Active stores ───────────────────────────────────────────────────────────
  console.log('\n--- Active Stores ---')

  const stores = await prisma.store.findMany({
    where:   { isActive: true },
    select:  { slug: true, name: true, affiliateUrl: true },
    orderBy: { slug: 'asc' },
  })

  if (stores.length === 0) {
    console.warn('[WARNING] No active stores found — domain matching in sync-prices.ts will fail for all perfumes')
  } else {
    for (const s of stores) {
      const missingUrl = !s.affiliateUrl || s.affiliateUrl.trim() === ''
      const urlLabel   = missingUrl ? '⚠️  (empty)' : s.affiliateUrl
      console.log(`  ${s.slug.padEnd(20)} | ${s.name.padEnd(25)} | ${urlLabel}`)
      if (missingUrl) {
        console.warn(`  [WARNING] store "${s.slug}" has no affiliateUrl — domain matching will fail for this store`)
      }
    }
    console.log(`\nTotal active stores: ${stores.length}`)
  }

  console.log('\n=== [check-baseline] Done ===\n')
}

main()
  .catch((err) => {
    console.error('[baseline] Fatal error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
