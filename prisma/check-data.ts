// prisma/check-data.ts
// Quick script to check database data
import { PrismaClient, type Perfume } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 Database Check:\n')

  // Check stores
  const storesCount = await prisma.store.count({ where: { isActive: true } })
  const allStores = await prisma.store.findMany({ where: { isActive: true } })
  console.log(`🏪 STORES: ${storesCount} active stores`)
  allStores.forEach((s) => console.log(`   - ${s.name} (${s.slug})`))

  // Check prices
  const pricesCount = await prisma.price.count()
  console.log(`\n💰 PRICES: ${pricesCount} total prices`)

  // Check perfumes
  const perfumes = await prisma.perfume.findMany({ take: 3 })
  console.log(`\n🌸 PERFUMES: ${perfumes.length} found (showing first 3)`)
  perfumes.forEach((p: Perfume) => console.log(`   - ID: ${p.id} | ${p.name} (${p.brand})`))

  if (perfumes.length > 0) {
    console.log(`\n✅ First perfume ID: ${perfumes[0].id}`)
    console.log(`\n🔗 Test API: http://localhost:3000/api/prices/compare?perfumeId=${perfumes[0].id}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
