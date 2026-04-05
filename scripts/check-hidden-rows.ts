/**
 * scripts/check-hidden-rows.ts
 * Reveals Price rows that exist in DB but are filtered out by /api/store-prices.
 *
 * Run:
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/check-hidden-rows.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  console.error('[hidden-rows] DATABASE_URL env var is required')
  process.exit(1)
}

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
const prisma   = new PrismaClient({ adapter } as any)

async function main() {
  console.log('\n=== [check-hidden-rows] Price row visibility audit ===\n')

  // ── totalRows ───────────────────────────────────────────────────────────────
  const totalRows = await prisma.price.count()

  // ── Each filter failure category ────────────────────────────────────────────
  const missingUrl    = await prisma.price.count({ where: { listingUrl:  null } })
  const unavailable   = await prisma.price.count({ where: { isAvailable: false } })
  const inactiveStore = await prisma.price.count({ where: { store: { isActive: false } } })

  // ── visibleRows: passes ALL filters (matching /api/store-prices exactly) ────
  const visibleRows = await prisma.price.count({
    where: {
      isAvailable: true,
      listingUrl:  { not: null },
      store:       { isActive: true },
    },
  })

  const hiddenTotal = totalRows - visibleRows
  const categorySum = missingUrl + unavailable + inactiveStore

  // ── Output ──────────────────────────────────────────────────────────────────
  console.log(`totalRows      : ${totalRows}`)
  console.log(`visibleRows    : ${visibleRows}`)
  console.log(`hiddenTotal    : ${hiddenTotal}`)
  console.log('')
  console.log('--- Hidden row breakdown ---')
  console.log(`missingUrl     : ${missingUrl}`)
  console.log(`unavailable    : ${unavailable}`)
  console.log(`inactiveStore  : ${inactiveStore}`)

  if (categorySum > hiddenTotal) {
    console.log(`\nNote: category sum (${categorySum}) > hiddenTotal (${hiddenTotal}) — categories overlap (one row may match multiple filters)`)
  }

  console.log('')
  if (missingUrl > 0)    console.warn(`[WARNING] ${missingUrl} rows have no listingUrl — these will never appear in /api/store-prices`)
  if (unavailable > 0)   console.warn(`[WARNING] ${unavailable} rows are marked isAvailable=false — these will never appear in /api/store-prices`)
  if (inactiveStore > 0) console.warn(`[WARNING] ${inactiveStore} rows belong to inactive stores — these will never appear in /api/store-prices`)

  console.log('\n=== [check-hidden-rows] Done ===\n')
}

main()
  .catch((err) => {
    console.error('[hidden-rows] Fatal error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
