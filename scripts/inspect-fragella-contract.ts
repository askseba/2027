/**
 * Phase A verification script — READ ONLY, writes nothing to DB.
 * Prints first 20 Perfume records: id, name, brand, fragellaSlug
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const perfumes = await prisma.perfume.findMany({
    take: 20,
    select: {
      id: true,
      name: true,
      brand: true,
      fragellaSlug: true,
    },
  })

  console.log(`\n=== fragellaSlug contract sample (first ${perfumes.length} records) ===\n`)
  console.log(`${'id'.padEnd(36)} | ${'brand'.padEnd(20)} | ${'name'.padEnd(35)} | fragellaSlug`)
  console.log('-'.repeat(110))

  for (const p of perfumes) {
    const id = String(p.id ?? '').padEnd(36)
    const brand = String(p.brand ?? '').padEnd(20)
    const name = String(p.name ?? '').slice(0, 35).padEnd(35)
    const slug = p.fragellaSlug ?? 'NULL'
    console.log(`${id} | ${brand} | ${name} | ${slug}`)
  }

  console.log('\n=== Done ===\n')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
