// prisma/fill-prices.ts
// Script to fill sample prices for 3 perfumes across 7 stores (21 prices total)
// Run: npx tsx prisma/fill-prices.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error']
})

async function main() {
  console.log('🌱 Starting price fill...')

  // Get first 3 perfumes from database (or use specific IDs)
  const perfumes = await prisma.perfume.findMany({
    take: 3,
    orderBy: { baseScore: 'desc' }
  })

  if (perfumes.length === 0) {
    console.error('❌ No perfumes found! Please run seed first: npx prisma db seed')
    return
  }

  // Get all active stores
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' }
  })

  if (stores.length === 0) {
    console.error('❌ No active stores found! Please run seed first: npx prisma db seed')
    return
  }

  console.log(`📦 Found ${perfumes.length} perfumes and ${stores.length} stores`)

  let totalPrices = 0

  // Fill prices for each perfume in each store
  for (const perfume of perfumes) {
    console.log(`\n🌸 Processing: ${perfume.name} (${perfume.brand})`)
    
    for (const store of stores) {
      // Generate random price: base price ± 20% variation + store-specific offset
      const basePrice = perfume.price || 299
      const storeOffset = (store.id % 3) * 20 // Vary by store
      const randomVariation = (Math.random() * 0.4 - 0.2) * basePrice // ±20%
      const finalPrice = Math.round(basePrice + storeOffset + randomVariation)

      await prisma.price.upsert({
        where: {
          perfumeId_storeId: {
            perfumeId: perfume.id,
            storeId: store.id
          }
        },
        create: {
          perfumeId: perfume.id,
          storeId: store.id,
          price: finalPrice,
          currency: 'SAR'
        },
        update: {
          price: finalPrice
        }
      })

      console.log(`  ✅ ${store.name}: ${finalPrice} SAR`)
      totalPrices++
    }
  }

  console.log(`\n🎉 Successfully filled ${totalPrices} prices!`)
  console.log(`📊 ${perfumes.length} perfumes × ${stores.length} stores = ${totalPrices} prices`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
