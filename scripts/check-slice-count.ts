/**
 * scripts/check-slice-count.ts
 * Writes a single integer to stdout: the number of perfumes in a given slice.
 * Used by run-full-sweep.sh for stop-condition detection.
 *
 * Env vars:
 *   SLICE_OFFSET   skip N perfumes (default: 0)
 *   SLICE_LIMIT    take N perfumes (default: 20)
 *
 * Stdout: integer only (no newline padding beyond the number itself)
 * Exit 1 on any error — run-full-sweep.sh uses set -euo pipefail
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

if (!process.env.DATABASE_URL) {
  process.stderr.write('[check-slice-count] DATABASE_URL env var is required\n')
  process.exit(1)
}

const SLICE_OFFSET = parseInt(process.env.SLICE_OFFSET ?? '0',  10)
const SLICE_LIMIT  = parseInt(process.env.SLICE_LIMIT  ?? '20', 10)

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
const prisma   = new PrismaClient({ adapter } as any)

async function main() {
  const rows = await prisma.perfume.findMany({
    where:   { fragellaSlug: { not: null } },
    orderBy: { fragellaSlug: 'asc' },
    skip:    SLICE_OFFSET,
    take:    SLICE_LIMIT,
    select:  { id: true },
  })

  process.stdout.write(String(rows.length))
}

main()
  .catch((err) => {
    process.stderr.write(`[check-slice-count] Fatal error: ${err?.message ?? err}\n`)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
