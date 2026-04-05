/**
 * prisma/add-stores.ts
 * Idempotent — safe to run multiple times. Uses upsert on slug.
 * Run with: npx dotenv-cli -e .env.local -- npx tsx prisma/add-stores.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  console.error('[add-stores] DATABASE_URL env var is required')
  process.exit(1)
}

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
const prisma = new PrismaClient({ adapter } as any)

const STORES = [
  {
    name:         'Nahdi Online',
    slug:         'nahdi',
    affiliateUrl: 'https://www.nahdionline.com/?utm_source=askseba',
    commission:   6.0,
    isActive:     true,
  },
  {
    name:         'Selfridges',
    slug:         'selfridges',
    affiliateUrl: 'https://www.selfridges.com/?utm_source=askseba',
    commission:   8.0,
    isActive:     true,
  },
  {
    name:         'Sephora ME',
    slug:         'sephora-me',
    affiliateUrl: 'https://www.sephora.me/?utm_source=askseba',
    commission:   7.0,
    isActive:     true,
  },
  {
    name:         'Essenza Nobile',
    slug:         'essenza-nobile',
    affiliateUrl: 'https://www.essenza-nobile.de/?utm_source=askseba',
    commission:   6.0,
    isActive:     true,
  },
  {
    name:         'FragranceX',
    slug:         'fragrancex',
    affiliateUrl: 'https://www.fragrancex.com/?utm_source=askseba',
    commission:   10.0,
    isActive:     true,
  },
]

async function main() {
  console.log('[add-stores] Upserting stores...')

  for (const store of STORES) {
    await prisma.store.upsert({
      where:  { slug: store.slug },
      update: {
        name:         store.name,
        affiliateUrl: store.affiliateUrl,
        commission:   store.commission,
        isActive:     store.isActive,
      },
      create: store,
    })
    console.log(`[add-stores] ✅ Upserted: ${store.name} (${store.slug})`)
  }

  console.log(`[add-stores] Done — ${STORES.length} store(s) upserted.`)
}

main()
  .catch(err => { console.error('[add-stores] Fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
