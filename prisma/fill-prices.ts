/**
 * prisma/fill-prices.ts
 * Phase B — Step 2: Seed Price rows for a small, fixed set of well-known perfumes.
 *
 * Rules:
 *  - Seeds prices for at most 3 perfumes
 *  - Each perfume gets at most 3 stores
 *  - ONLY perfumes where fragellaSlug IS NOT NULL (run backfill-slugs.ts first)
 *  - Uses upsert on (perfumeId, storeId) — safe to re-run without duplicates
 *  - All stores must be active (Store.isActive = true)
 *  - listingUrl is a structurally valid placeholder URL (not scraped)
 *  - price > 0, currency = 'SAR', isAvailable = true
 *
 * Run: npx tsx prisma/fill-prices.ts
 * Prerequisite: prisma/backfill-slugs.ts must have run first.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Perfumes to seed prices for, identified by fragellaSlug.
 * slugs are produced by the canonical formula in convertSimilarToScoredPerfume.
 */
const TARGET_PERFUMES = [
  {
    fragellaSlug: 'creed-aventus',
    stores: [
      { storeSlug: 'goldenscent', price: 595, listingUrl: 'https://www.goldenscent.com/en/creed-aventus-edp-100ml/p-1001' },
      { storeSlug: 'niceone',     price: 579, listingUrl: 'https://niceonesa.com/en/creed-aventus-edp-100ml/p-2001' },
      { storeSlug: 'faces',       price: 620, listingUrl: 'https://www.faces.sa/en/creed-aventus-edp-100ml/p-3001' }
    ]
  },
  {
    fragellaSlug: 'chanel-bleu-de-chanel',
    stores: [
      { storeSlug: 'goldenscent', price: 460, listingUrl: 'https://www.goldenscent.com/en/chanel-bleu-de-chanel-edp-100ml/p-1002' },
      { storeSlug: 'niceone',     price: 445, listingUrl: 'https://niceonesa.com/en/chanel-bleu-de-chanel-edp-100ml/p-2002' }
    ]
  },
  {
    fragellaSlug: 'tom-ford-oud-wood',
    stores: [
      { storeSlug: 'goldenscent', price: 680, listingUrl: 'https://www.goldenscent.com/en/tom-ford-oud-wood-edp-50ml/p-1003' },
      { storeSlug: 'faces',       price: 710, listingUrl: 'https://www.faces.sa/en/tom-ford-oud-wood-edp-50ml/p-3003' }
    ]
  }
]

async function main() {
  console.log('[fill-prices] Starting price seed...\n')

  // Load all active stores into a slug→record map
  const activeStores = await prisma.store.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, name: true }
  })
  if (activeStores.length === 0) {
    console.error('[fill-prices] No active stores found. Run: npx prisma db seed')
    process.exit(1)
  }
  const storeBySlug = new Map(activeStores.map(s => [s.slug, s]))
  console.log(`[fill-prices] Active stores available: ${activeStores.map(s => s.slug).join(', ')}`)

  let totalUpserted = 0
  let totalSkipped = 0

  for (const target of TARGET_PERFUMES) {
    // CRITICAL: only seed if fragellaSlug is non-null in DB
    const perfume = await prisma.perfume.findFirst({
      where: { fragellaSlug: target.fragellaSlug },
      select: { id: true, name: true, brand: true, fragellaSlug: true }
    })

    if (!perfume) {
      console.warn(
        `[fill-prices] SKIP — no perfume found with fragellaSlug="${target.fragellaSlug}". ` +
        `Run backfill-slugs.ts first.`
      )
      totalSkipped++
      continue
    }

    console.log(`\n[fill-prices] Seeding "${perfume.brand} ${perfume.name}" (slug="${perfume.fragellaSlug}")`)

    for (const entry of target.stores) {
      const store = storeBySlug.get(entry.storeSlug)
      if (!store) {
        console.warn(`  SKIP store "${entry.storeSlug}" — not found or inactive`)
        continue
      }

      await prisma.price.upsert({
        where: { perfumeId_storeId: { perfumeId: perfume.id, storeId: store.id } },
        update: {
          price: entry.price,
          currency: 'SAR',
          listingUrl: entry.listingUrl,
          isAvailable: true
        },
        create: {
          perfumeId: perfume.id,
          storeId: store.id,
          price: entry.price,
          currency: 'SAR',
          listingUrl: entry.listingUrl,
          isAvailable: true
        }
      })

      console.log(`  ✅ ${store.name} @ SAR ${entry.price}`)
      totalUpserted++
    }
  }

  console.log('\n[fill-prices] === Final Stats ===')
  console.log(`  Price rows upserted:                  ${totalUpserted}`)
  console.log(`  Perfumes skipped (no fragellaSlug):   ${totalSkipped}`)
  console.log('[fill-prices] Done.')
}

main()
  .catch((e) => { console.error('[fill-prices] Fatal error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
