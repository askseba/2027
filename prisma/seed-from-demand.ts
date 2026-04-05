/**
 * prisma/seed-from-demand.ts
 * Batch-seed missing Perfume rows from a pre-extracted demand JSON file.
 *
 * Usage:
 *   npx dotenv-cli -e .env.local -- npx tsx prisma/seed-from-demand.ts --file prisma/demand-signals.example.json
 *
 * Input: JSON array of { fragellaSlug, brand, name, image? }
 * Output: Creates missing Perfume rows only. Never updates existing rows.
 *         Never writes to Price or any other table.
 *         Makes no external API calls.
 */

import { readFileSync } from 'fs'
import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

// ---------------------------------------------------------------------------
// Prisma setup (same pattern as add-stores.ts, backfill-slugs.ts)
// ---------------------------------------------------------------------------

if (!process.env.DATABASE_URL) {
  console.error('[SEED_FATAL] DATABASE_URL env var is required')
  process.exit(1)
}

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
const prisma = new PrismaClient({ adapter } as any)

// ---------------------------------------------------------------------------
// Local slug helper (duplicated intentionally — no shared utility yet)
// Same formula as match/route.ts:118-119 and backfill-slugs.ts:20-26
// ---------------------------------------------------------------------------

function buildFragellaSlug(brand: string, name: string): string {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

interface DemandEntry {
  fragellaSlug: string
  brand: string
  name: string
  image?: string
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function getFilePath(): string {
  const args = process.argv.slice(2)
  const idx = args.indexOf('--file')
  if (idx === -1 || idx + 1 >= args.length) {
    console.error('[SEED_FATAL] Usage: npx tsx prisma/seed-from-demand.ts --file <path.json>')
    process.exit(1)
  }
  return args[idx + 1]
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateEntry(entry: unknown, index: number): DemandEntry | null {
  if (!entry || typeof entry !== 'object') {
    console.error(`[INVALID] index=${index} — not an object`)
    return null
  }

  const e = entry as Record<string, unknown>

  if (typeof e.fragellaSlug !== 'string' || !e.fragellaSlug.trim()) {
    console.error(`[INVALID] index=${index} — missing or empty fragellaSlug`)
    return null
  }
  if (typeof e.brand !== 'string' || !e.brand.trim()) {
    console.error(`[INVALID] index=${index} — missing or empty brand`)
    return null
  }
  if (typeof e.name !== 'string' || !e.name.trim()) {
    console.error(`[INVALID] index=${index} — missing or empty name`)
    return null
  }

  const slug = e.fragellaSlug as string
  const brand = e.brand as string
  const name = e.name as string

  const expectedSlug = buildFragellaSlug(brand, name)
  if (expectedSlug !== slug) {
    console.error(
      `[INVALID] ${slug} slug mismatch — expected "${expectedSlug}" from brand="${brand}" name="${name}"`
    )
    return null
  }

  return {
    fragellaSlug: slug,
    brand,
    name,
    image: typeof e.image === 'string' && e.image.trim() ? e.image.trim() : undefined,
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const filePath = getFilePath()

  // Read and parse JSON
  let raw: string
  try {
    raw = readFileSync(filePath, 'utf-8')
  } catch (err: any) {
    console.error(`[SEED_FATAL] Cannot read file "${filePath}": ${err?.message ?? err}`)
    process.exit(1)
  }

  let entries: unknown[]
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      console.error('[SEED_FATAL] JSON must be an array at the top level')
      process.exit(1)
    }
    entries = parsed
  } catch (err: any) {
    console.error(`[SEED_FATAL] Invalid JSON: ${err?.message ?? err}`)
    process.exit(1)
  }

  console.log(`[SEED_START] Processing ${entries.length} perfumes from ${filePath}`)

  const stats = { created: 0, skipped: 0, invalid: 0, errors: 0 }

  for (let i = 0; i < entries.length; i++) {
    const validated = validateEntry(entries[i], i)

    if (!validated) {
      stats.invalid++
      continue
    }

    try {
      const existing = await prisma.perfume.findFirst({
        where: { fragellaSlug: validated.fragellaSlug },
        select: { id: true },
      })

      if (existing) {
        console.log(`[SKIPPED] ${validated.fragellaSlug} already exists`)
        stats.skipped++
        continue
      }

      await prisma.perfume.create({
        data: {
          name: validated.name,
          brand: validated.brand,
          image: validated.image || '/placeholder-perfume.svg',
          fragellaSlug: validated.fragellaSlug,
        },
      })

      console.log(`[CREATED] ${validated.fragellaSlug}`)
      stats.created++
    } catch (err: any) {
      // P2002 = unique constraint violation (race condition or duplicate in input)
      if (err?.code === 'P2002') {
        console.log(`[SKIPPED] ${validated.fragellaSlug} already exists (unique constraint)`)
        stats.skipped++
      } else {
        console.error(`[ERROR] ${validated.fragellaSlug} failed: ${err?.message ?? err}`)
        stats.errors++
      }
    }
  }

  console.log(
    `[SEED_COMPLETE] Created: ${stats.created}, Skipped: ${stats.skipped}, Invalid: ${stats.invalid}, Errors: ${stats.errors}`
  )
}

main()
  .catch((err) => {
    console.error('[SEED_FATAL] Unexpected error:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
