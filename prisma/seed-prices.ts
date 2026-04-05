// prisma/seed-prices.ts
// Commercial data: mappings, prices, discount codes
// Run: npx tsx prisma/seed-prices.ts
// Uses upsert — safe to re-run without data loss

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================
// EXPLICIT MAPPINGS: fragellaSlug → Perfume.id
// ============================================
// IMPORTANT: These mappings MUST be verified against perfumesData in seed.ts.
// The fragellaSlug is derived from Fragella's Brand+Name:
//   `${brand}-${name}`.toLowerCase()
//     .replace(/[^a-z0-9\s-]/g,'')
//     .replace(/\s+/g,'-')
//
// Before uncommenting any mapping:
// 1. Check seed.ts perfumesData for the exact id, name, and brand
// 2. Confirm there are no duplicate entries for the same perfume
// 3. Construct the expected fragellaSlug and verify it matches

const FRAGELLA_MAPPINGS: Array<{ fragellaSlug: string; perfumeId: string }> = [
  // TODO: Owner must verify each mapping against seed.ts perfumesData.
  // Example format:
  // { fragellaSlug: 'chanel-bleu-de-chanel', perfumeId: '1' },  // seed.ts: id='1', name='Bleu de Chanel', brand='Chanel'
  // { fragellaSlug: 'creed-aventus', perfumeId: '2' },           // seed.ts: id='2', name='Aventus', brand='Creed'
  //   // TODO: owner verify — possible duplicate
  //   // NOTE: id='11' is also named 'Creed Aventus' — verify which is canonical
]

// ============================================
// STORE METADATA (discount codes, logos)
// ============================================

const STORE_METADATA: Array<{
  storeSlug: string
  discountCode: string | null
  discountLabel: string | null
  discountExpiry: Date | null
  logoUrl: string | null
}> = [
  { storeSlug: 'faces', discountCode: null, discountLabel: null, discountExpiry: null, logoUrl: '/stores/faces.svg' },
  { storeSlug: 'niceone', discountCode: null, discountLabel: null, discountExpiry: null, logoUrl: '/stores/niceone.svg' },
  {
    storeSlug: 'goldenscent',
    discountCode: null,
    discountLabel: null,
    discountExpiry: null,
    logoUrl: '/stores/goldenscent.svg',
  },
  { storeSlug: 'sultan', discountCode: null, discountLabel: null, discountExpiry: null, logoUrl: '/stores/sultan.svg' },
  { storeSlug: 'lojastore', discountCode: null, discountLabel: null, discountExpiry: null, logoUrl: '/stores/lojastore.svg' },
  { storeSlug: 'vanilla', discountCode: null, discountLabel: null, discountExpiry: null, logoUrl: '/stores/vanilla.svg' },
  { storeSlug: 'ounass-sa', discountCode: null, discountLabel: null, discountExpiry: null, logoUrl: '/stores/ounass.svg' },
]

// ============================================
// PRICE DATA — EMPTY until owner provides verified data
// ============================================
// Each entry requires ALL of:
//   - fragellaSlug that exists in FRAGELLA_MAPPINGS
//   - storeSlug that exists in the stores table
//   - real price from the actual store page
//   - real listingUrl (direct product page link, NOT homepage)
//
// Do NOT add placeholder or guessed data.

const PRICE_DATA: Array<{
  fragellaSlug: string
  storeSlug: string
  price: number
  currency: string
  listingUrl: string
  isAvailable: boolean
}> = [
  // Owner will add verified entries here. Example format:
  // {
  //   fragellaSlug: 'chanel-bleu-de-chanel',
  //   storeSlug: 'faces',
  //   price: 459,
  //   currency: 'SAR',
  //   listingUrl: 'https://www.faces.sa/chanel-bleu-de-chanel-edp-100ml.html',
  //   isAvailable: true,
  // },
]

// ============================================
// SEEDING FUNCTIONS
// ============================================

async function seedMappings() {
  console.log('[seed-prices] Seeding Fragella → Perfume mappings...')
  let updated = 0
  let skipped = 0

  for (const mapping of FRAGELLA_MAPPINGS) {
    try {
      const result = await prisma.perfume.update({
        where: { id: mapping.perfumeId },
        data: { fragellaSlug: mapping.fragellaSlug },
      })
      console.log(`  ✅ ${result.name} → ${mapping.fragellaSlug}`)
      updated++
    } catch {
      console.warn(
        `  ⚠️ Skipped mapping ${mapping.perfumeId} → ${mapping.fragellaSlug}: ` +
          'Perfume not found or constraint violation',
      )
      skipped++
    }
  }
  console.log(`  Mapped: ${updated}, Skipped: ${skipped}`)
}

async function seedStoreMetadata() {
  console.log('\n[seed-prices] Updating store metadata...')

  for (const store of STORE_METADATA) {
    try {
      await prisma.store.update({
        where: { slug: store.storeSlug },
        data: {
          discountCode: store.discountCode,
          discountLabel: store.discountLabel,
          discountExpiry: store.discountExpiry,
          logoUrl: store.logoUrl,
          lastSyncAt: new Date(),
        },
      })
      console.log(`  ✅ ${store.storeSlug}`)
    } catch {
      console.warn(`  ⚠️ Store not found: ${store.storeSlug}`)
    }
  }
}

async function seedPrices() {
  console.log('\n[seed-prices] Seeding prices...')

  if (PRICE_DATA.length === 0) {
    console.log('  ℹ️ PRICE_DATA is empty — no prices to seed. Owner must add verified data.')
    return
  }

  let created = 0
  let skipped = 0

  for (const entry of PRICE_DATA) {
    const perfume = await prisma.perfume.findFirst({
      where: { fragellaSlug: entry.fragellaSlug },
      select: { id: true },
    })
    if (!perfume) {
      console.warn(`  ⚠️ No mapping for ${entry.fragellaSlug} — skipping price`)
      skipped++
      continue
    }

    const store = await prisma.store.findUnique({
      where: { slug: entry.storeSlug },
      select: { id: true },
    })
    if (!store) {
      console.warn(`  ⚠️ Store not found: ${entry.storeSlug} — skipping price`)
      skipped++
      continue
    }

    await prisma.price.upsert({
      where: {
        perfumeId_storeId: {
          perfumeId: perfume.id,
          storeId: store.id,
        },
      },
      update: {
        price: entry.price,
        currency: entry.currency,
        listingUrl: entry.listingUrl,
        isAvailable: entry.isAvailable,
      },
      create: {
        perfumeId: perfume.id,
        storeId: store.id,
        price: entry.price,
        currency: entry.currency,
        listingUrl: entry.listingUrl,
        isAvailable: entry.isAvailable,
      },
    })
    console.log(`  ✅ ${entry.fragellaSlug} @ ${entry.storeSlug}: ${entry.price} ${entry.currency}`)
    created++
  }
  console.log(`  Created/Updated: ${created}, Skipped: ${skipped}`)
}

async function main() {
  console.log('[seed-prices] Starting commercial data seed...\n')
  await seedMappings()
  await seedStoreMetadata()
  await seedPrices()
  console.log('\n[seed-prices] Done.')
}

main()
  .catch((e) => {
    console.error('[seed-prices] Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
