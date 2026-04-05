/**
 * scripts/sync-prices.ts
 * Phase D — DataForSEO Google Shopping price sync.
 *
 * Standalone script — NOT an API route. Run with:
 *   npx tsx scripts/sync-prices.ts
 *
 * Env vars:
 *   DATAFORSEO_LOGIN          required
 *   DATAFORSEO_PASSWORD       required
 *   SYNC_LIMIT                max perfumes to process (default: 5)
 *   SYNC_FRESHNESS_HOURS      skip perfumes with prices updated within N hours (default: 48)
 *   DATAFORSEO_LOCATION_CODE  Google Shopping location code (default: 2682 = Saudi Arabia)
 *                             Verify at: GET https://api.dataforseo.com/v3/merchant/google/locations
 *
 * Flow (DataForSEO Standard method — two-stage):
 *   Stage 1 — Products:
 *     1. POST /v3/merchant/google/products/task_post  — discover candidate products by keyword
 *     2. Poll  /v3/merchant/google/products/tasks_ready
 *     3. GET   /v3/merchant/google/products/task_get/advanced/{id}
 *        → extract top 3 candidates per perfume: product_id + data_docid + gid
 *   Stage 2 — Sellers:
 *     4. POST /v3/merchant/google/sellers/task_post  — fetch seller-level pricing per candidate
 *     5. Poll  /v3/merchant/google/sellers/tasks_ready
 *     6. GET   /v3/merchant/google/sellers/task_get/advanced/{id}
 *        → seller items: url, seller_name, total_price, currency
 *        → match seller url domain OR normalised seller_name against trusted stores
 *        → upsert matched rows to Price table
 */

import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

// PrismaNeonHttp connects via Neon's HTTPS API (port 443) instead of raw TCP
// port 5432 — required when port 5432 is blocked in the runtime environment.

// ─── Config ──────────────────────────────────────────────────────────────────

const DATAFORSEO_BASE      = 'https://api.dataforseo.com/v3'
const SYNC_LIMIT           = parseInt(process.env.SYNC_LIMIT          ?? '5',  10)
const SYNC_OFFSET          = parseInt(process.env.SYNC_OFFSET          ?? '0',  10)
const FRESHNESS_HOURS      = parseInt(process.env.SYNC_FRESHNESS_HOURS ?? '48', 10)
const LOCATION_CODE        = parseInt(process.env.DATAFORSEO_LOCATION_CODE ?? '2682', 10)
const LANGUAGE_CODE        = 'en'
/** Max product candidates to send to the sellers endpoint per perfume (cost control) */
const MAX_SELLER_CANDIDATES = 3
/** ms to wait between polling tasks_ready */
const POLL_INTERVAL_MS     = 5_000
/** max poll attempts before giving up on a batch */
const MAX_POLL_ATTEMPTS    = 24  // 24 × 5s = 2 min max wait

// Adapter is constructed lazily inside main() after DATABASE_URL is confirmed
let prisma: PrismaClient

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductsTask {
  task_id:   string
  perfumeId: string
  keyword:   string
}

/** Fields extracted from a products result item, used to POST a sellers task */
interface ProductCandidate {
  perfumeId:   string
  keyword:     string
  product_id:  string | null
  data_docid:  string | null
  gid:         string | null
}

interface SellerTask {
  task_id:   string
  perfumeId: string
  keyword:   string
}

/** Seller-level item from sellers/task_get/advanced — documented field names */
interface SellerItem {
  url?:         string | null   // "Google Shopping URL forwarding to the product page on the seller's website"
  seller_name?: string | null   // "name of the seller"
  total_price?: number | null   // price as flat integer (includes tax/shipping)
  currency?:    string | null   // ISO 4217 currency code
  [key: string]: unknown
}

/** Products result item — fields needed to build seller tasks */
interface ProductItem {
  product_id?:  string | null
  data_docid?:  string | null
  gid?:         string | null
  [key: string]: unknown
}

interface Stats {
  processed:      number
  skippedFresh:   number
  noResults:      number
  sellerTasks:    number   // total seller tasks posted
  noStoreMatch:   number
  invalidData:    number
  written:        number
  errors:         number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** Normalise a store/seller name for fuzzy matching: lowercase, alphanumeric only */
function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function makeAuthHeader(login: string, password: string): string {
  return 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64')
}

async function dfsPost(path: string, body: unknown, auth: string): Promise<any> {
  const res = await fetch(`${DATAFORSEO_BASE}${path}`, {
    method:  'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`DataForSEO POST ${path} → HTTP ${res.status}`)
  return res.json()
}

async function dfsGet(path: string, auth: string): Promise<any> {
  const res = await fetch(`${DATAFORSEO_BASE}${path}`, {
    method:  'GET',
    headers: { Authorization: auth }
  })
  if (!res.ok) throw new Error(`DataForSEO GET ${path} → HTTP ${res.status}`)
  return res.json()
}

/** Poll a tasks_ready endpoint until all ids are resolved or MAX_POLL_ATTEMPTS exceeded. */
async function pollUntilReady(
  readyPath: string,
  ids: Set<string>,
  auth: string,
  label: string
): Promise<Set<string>> {
  const readyIds    = new Set<string>()
  const pendingIds  = new Set(ids)
  let   pollAttempts = 0

  while (pendingIds.size > 0 && pollAttempts < MAX_POLL_ATTEMPTS) {
    await sleep(POLL_INTERVAL_MS)
    pollAttempts++

    let readyRes: any
    try {
      readyRes = await dfsGet(readyPath, auth)
    } catch (err: any) {
      console.warn(`[sync] ${label} poll attempt ${pollAttempts} failed: ${err?.message ?? err}`)
      continue
    }

    const readyList: { id?: string }[] = readyRes?.tasks?.[0]?.result ?? []
    for (const item of readyList) {
      if (item.id && pendingIds.has(item.id)) {
        readyIds.add(item.id)
        pendingIds.delete(item.id)
      }
    }

    if (pendingIds.size > 0) {
      console.log(
        `[sync] ${label} waiting... ${pendingIds.size} task(s) still pending` +
        ` (attempt ${pollAttempts}/${MAX_POLL_ATTEMPTS})`
      )
    }
  }

  if (pendingIds.size > 0) {
    console.warn(`[sync] ${label} timed out — ${pendingIds.size} task(s) never became ready: ${[...pendingIds].join(', ')}`)
  }

  return readyIds
}

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── Credential guard ────────────────────────────────────────────────────
  if (!process.env.DATAFORSEO_LOGIN || !process.env.DATAFORSEO_PASSWORD) {
    console.error('[sync] DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD env vars are required')
    process.exit(1)
  }
  if (!process.env.DATABASE_URL) {
    console.error('[sync] DATABASE_URL env var is required')
    process.exit(1)
  }
  const auth = makeAuthHeader(process.env.DATAFORSEO_LOGIN, process.env.DATAFORSEO_PASSWORD)

  // Initialise Prisma with Neon HTTP adapter (avoids port 5432 requirement)
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {})
  prisma = new PrismaClient({ adapter } as any)

  console.log('[sync] Starting DataForSEO price sync (products → sellers two-stage)')
  console.log(`[sync] Config: SYNC_LIMIT=${SYNC_LIMIT}, SYNC_OFFSET=${SYNC_OFFSET}, FRESHNESS_HOURS=${FRESHNESS_HOURS}, LOCATION_CODE=${LOCATION_CODE}`)

  // ── Step 1: Load active stores + build domain map + normalised name map ──
  const activeStores = await prisma.store.findMany({
    where:  { isActive: true },
    select: { id: true, slug: true, name: true, affiliateUrl: true }
  })
  if (activeStores.length === 0) {
    console.error('[sync] No active stores found. Exiting.')
    process.exit(1)
  }

  // domain → store  (value is the raw store record, not the augmented object)
  const storeByDomain = new Map(
    activeStores
      .map(s => ({ store: s, domain: extractDomain(s.affiliateUrl) }))
      .filter(e => e.domain)
      .map(e => [e.domain, e.store] as const)
  )

  // normalised name → store  (e.g. "goldenscent" → Golden Scent store)
  const storeByNorm = new Map(
    activeStores.map(s => [normalizeName(s.name), s] as const)
  )

  console.log(`[sync] Trusted domains: ${[...storeByDomain.keys()].join(', ')}`)
  console.log(`[sync] Trusted names  : ${[...storeByNorm.keys()].join(', ')}`)

  // ── Step 2: Load perfumes with non-null fragellaSlug ────────────────────
  const perfumes = await prisma.perfume.findMany({
    where:   { fragellaSlug: { not: null } },
    orderBy: { fragellaSlug: 'asc' },
    skip:    SYNC_OFFSET,
    take:    SYNC_LIMIT,
    select:  { id: true, name: true, brand: true, fragellaSlug: true },
  })
  console.log(`[sync] Perfumes to process (up to ${SYNC_LIMIT}): ${perfumes.length}`)
  console.log(`[sync] Batch: offset=${SYNC_OFFSET} limit=${SYNC_LIMIT} fetched=${perfumes.length}`)

  const stats: Stats = {
    processed:    0,
    skippedFresh: 0,
    noResults:    0,
    sellerTasks:  0,
    noStoreMatch: 0,
    invalidData:  0,
    written:      0,
    errors:       0
  }

  // ════════════════════════════════════════════════════════════════════
  // STAGE 1 — Products: discover candidate product identifiers
  // ════════════════════════════════════════════════════════════════════

  const productsTasks: (ProductsTask | null)[] = []

  for (const perfume of perfumes) {
    stats.processed++

    // Freshness check
    const latestPrice = await prisma.price.findFirst({
      where:   { perfumeId: perfume.id },
      orderBy: { updatedAt: 'desc' },
      select:  { updatedAt: true }
    })
    if (latestPrice) {
      const ageMs = Date.now() - latestPrice.updatedAt.getTime()
      if (ageMs < FRESHNESS_HOURS * 3_600_000) {
        const ageH = (ageMs / 3_600_000).toFixed(1)
        console.log(`[sync] SKIP "${perfume.brand} ${perfume.name}" — fresh (${ageH}h < ${FRESHNESS_HOURS}h)`)
        stats.skippedFresh++
        productsTasks.push(null)
        continue
      }
    }

    const keyword = `${perfume.name} ${perfume.brand} perfume`
    console.log(`[sync] [products] Queuing "${keyword}" (fragellaSlug=${perfume.fragellaSlug})`)

    try {
      const postRes = await dfsPost(
        '/merchant/google/products/task_post',
        [{ keyword, location_code: LOCATION_CODE, language_code: LANGUAGE_CODE, priority: 1 }],
        auth
      )

      const taskData   = postRes?.tasks?.[0]
      const taskId     = taskData?.id as string | undefined
      const statusCode = taskData?.status_code as number ?? 0

      if (!taskId || statusCode < 20000 || statusCode >= 30000) {
        console.warn(`[sync] [products] POST failed for "${keyword}": status=${statusCode} msg=${taskData?.status_message ?? 'unknown'}`)
        stats.errors++
        productsTasks.push(null)
        continue
      }

      productsTasks.push({ task_id: taskId, perfumeId: perfume.id, keyword })
    } catch (err: any) {
      console.warn(`[sync] [products] ERROR posting "${keyword}": ${err?.message ?? err}`)
      stats.errors++
      productsTasks.push(null)
    }
  }

  const activeProductsTasks = productsTasks.filter((t): t is ProductsTask => t !== null)

  if (activeProductsTasks.length === 0) {
    console.log('[sync] No products tasks to poll — exiting early.')
    console.log('\n[sync] Complete:', JSON.stringify(stats, null, 2))
    return
  }

  // Poll products/tasks_ready
  const productsReadyIds = await pollUntilReady(
    '/merchant/google/products/tasks_ready',
    new Set(activeProductsTasks.map(t => t.task_id)),
    auth,
    '[products]'
  )

  // Collect seller candidates from products results
  const sellerCandidates: ProductCandidate[] = []

  for (const task of activeProductsTasks) {
    if (!productsReadyIds.has(task.task_id)) {
      stats.errors++
      continue
    }

    let getRes: any
    try {
      getRes = await dfsGet(`/merchant/google/products/task_get/advanced/${task.task_id}`, auth)
    } catch (err: any) {
      console.warn(`[sync] [products] ERROR fetching ${task.task_id}: ${err?.message ?? err}`)
      stats.errors++
      continue
    }

    const items: ProductItem[] = getRes?.tasks?.[0]?.result?.[0]?.items ?? []

    if (items.length === 0) {
      console.log(`[sync] [products] noResults — "${task.keyword}"`)
      stats.noResults++
      continue
    }

    // Extract top MAX_SELLER_CANDIDATES candidates that have at least one identifier
    let candidateCount = 0
    for (const item of items) {
      if (candidateCount >= MAX_SELLER_CANDIDATES) break

      const product_id = typeof item.product_id === 'string' ? item.product_id : null
      const data_docid = typeof item.data_docid  === 'string' ? item.data_docid  : null
      const gid        = typeof item.gid         === 'string' ? item.gid         : null

      // Skip items with no usable identifier
      if (!product_id && !data_docid && !gid) continue

      sellerCandidates.push({
        perfumeId: task.perfumeId,
        keyword:   task.keyword,
        product_id,
        data_docid,
        gid,
      })
      candidateCount++
    }

    console.log(
      `[sync] [products] "${task.keyword}" → ${items.length} items, queuing ${candidateCount} seller candidate(s)`
    )
  }

  if (sellerCandidates.length === 0) {
    console.log('[sync] No seller candidates extracted from products results.')
    console.log('\n[sync] Complete:', JSON.stringify(stats, null, 2))
    return
  }

  // ════════════════════════════════════════════════════════════════════
  // STAGE 2 — Sellers: fetch seller-level pricing for each candidate
  // ════════════════════════════════════════════════════════════════════

  const sellerTasks: SellerTask[] = []

  for (const candidate of sellerCandidates) {
    // Build sellers task body with all available identifiers (docs recommend all three)
    const taskBody: Record<string, unknown> = {
      location_code: LOCATION_CODE,
      language_code: LANGUAGE_CODE,
      priority:      1,
    }
    if (candidate.product_id) taskBody.product_id = candidate.product_id
    if (candidate.data_docid) taskBody.data_docid  = candidate.data_docid
    if (candidate.gid)        taskBody.gid         = candidate.gid

    console.log(
      `[sync] [sellers] Queuing task — product_id=${candidate.product_id ?? 'null'}` +
      ` gid=${candidate.gid ?? 'null'} for "${candidate.keyword}"`
    )

    try {
      const postRes = await dfsPost('/merchant/google/sellers/task_post', [taskBody], auth)

      const taskData   = postRes?.tasks?.[0]
      const taskId     = taskData?.id as string | undefined
      const statusCode = taskData?.status_code as number ?? 0

      if (!taskId || statusCode < 20000 || statusCode >= 30000) {
        console.warn(`[sync] [sellers] POST failed: status=${statusCode} msg=${taskData?.status_message ?? 'unknown'}`)
        stats.errors++
        continue
      }

      sellerTasks.push({ task_id: taskId, perfumeId: candidate.perfumeId, keyword: candidate.keyword })
      stats.sellerTasks++
    } catch (err: any) {
      console.warn(`[sync] [sellers] ERROR posting task for "${candidate.keyword}": ${err?.message ?? err}`)
      stats.errors++
    }
  }

  if (sellerTasks.length === 0) {
    console.log('[sync] No seller tasks were posted successfully.')
    console.log('\n[sync] Complete:', JSON.stringify(stats, null, 2))
    return
  }

  // Poll sellers/tasks_ready
  const sellersReadyIds = await pollUntilReady(
    '/merchant/google/sellers/tasks_ready',
    new Set(sellerTasks.map(t => t.task_id)),
    auth,
    '[sellers]'
  )

  // Fetch seller results and write to DB
  // Track per-perfume write status to report noStoreMatch accurately
  const perfumeWroteAny = new Map<string, boolean>()

  for (const task of sellerTasks) {
    if (!sellersReadyIds.has(task.task_id)) {
      stats.errors++
      continue
    }

    const perfume = perfumes.find(p => p.id === task.perfumeId)!

    let getRes: any
    try {
      getRes = await dfsGet(`/merchant/google/sellers/task_get/advanced/${task.task_id}`, auth)
    } catch (err: any) {
      console.warn(`[sync] [sellers] ERROR fetching ${task.task_id}: ${err?.message ?? err}`)
      stats.errors++
      continue
    }

    const items: SellerItem[] = getRes?.tasks?.[0]?.result?.[0]?.items ?? []

    if (items.length === 0) {
      console.log(`[sync] [sellers] noResults — "${task.keyword}" task ${task.task_id}`)
      continue
    }

    // Log seller domains/names for diagnostic visibility
    const seenDomains = [...new Set(items.map(i => {
      try { return new URL(i.url ?? '').hostname.replace(/^www\./, '') } catch { return null }
    }).filter(Boolean))]
    const seenNames = [...new Set(items.map(i => i.seller_name).filter(Boolean))]
    console.log(`[sync] [sellers] "${task.keyword}" — ${items.length} seller item(s)`)
    console.log(`[sync] [sellers]   domains seen : ${seenDomains.join(', ') || '(none)'}`)
    console.log(`[sync] [sellers]   names seen   : ${seenNames.join(', ') || '(none)'}`)

    for (const item of items) {
      const rawUrl    = typeof item.url         === 'string' ? item.url.trim()         : null
      const sellerName = typeof item.seller_name === 'string' ? item.seller_name.trim() : null

      if (!rawUrl && !sellerName) { stats.invalidData++; continue }

      // Match 1a: exact domain match
      let matchedStore = rawUrl ? storeByDomain.get(extractDomain(rawUrl)) ?? null : null

      // Match 1b: subdomain fallback — e.g. en-saudi.ounass.com matches saudi.ounass.com
      if (!matchedStore && rawUrl) {
        const sellerDomain = extractDomain(rawUrl)
        for (const [trustedDomain, store] of storeByDomain) {
          if (sellerDomain.endsWith('.' + trustedDomain)) {
            matchedStore = store
            break
          }
        }
      }

      // Match 2 (fallback): normalised seller_name
      if (!matchedStore && sellerName) {
        matchedStore = storeByNorm.get(normalizeName(sellerName)) ?? null
      }

      if (!matchedStore) continue // not a trusted store — discard silently

      // Validate price (total_price is a flat integer per docs)
      const rawPrice = item.total_price
      const validatedPrice =
        typeof rawPrice === 'number' && isFinite(rawPrice) && rawPrice > 0
          ? rawPrice
          : null

      if (validatedPrice === null) {
        console.warn(`[sync] [sellers] Invalid price for "${task.keyword}" @ ${matchedStore.name}: ${rawPrice}`)
        stats.invalidData++
        continue
      }

      // Listing URL: prefer rawUrl; fall back to affiliate URL for the store (valid URL guard)
      const listingUrl = rawUrl ?? matchedStore.affiliateUrl
      if (!listingUrl) { stats.invalidData++; continue }

      // Upsert to Price table (idempotent on perfumeId + storeId)
      try {
        await prisma.price.upsert({
          where: {
            perfumeId_storeId: { perfumeId: perfume.id, storeId: matchedStore.id }
          },
          update: {
            price:      validatedPrice,
            listingUrl: listingUrl,
            isAvailable: true
          },
          create: {
            perfumeId:  perfume.id,
            storeId:    matchedStore.id,
            price:      validatedPrice,
            currency:   'SAR',
            listingUrl: listingUrl,
            isAvailable: true
          }
        })
        console.log(
          `[sync] ✅ Wrote: "${perfume.brand} ${perfume.name}" @ ${matchedStore.name}` +
          ` — SAR ${validatedPrice} (matched via ${rawUrl ? 'domain' : 'name'})`
        )
        stats.written++
        perfumeWroteAny.set(task.perfumeId, true)
      } catch (err: any) {
        console.warn(`[sync] Prisma write failed for "${task.keyword}" @ ${matchedStore.name}: ${err?.message ?? err}`)
        stats.errors++
      }
    }
  }

  // Count perfumes for which sellers tasks ran but nothing was written
  for (const task of sellerTasks) {
    if (!perfumeWroteAny.get(task.perfumeId)) {
      // Only count once per perfume
      if (!perfumeWroteAny.has(task.perfumeId)) {
        stats.noStoreMatch++
        perfumeWroteAny.set(task.perfumeId, false)
      }
    }
  }

  // ── Stats output ──────────────────────────────────────────────────────────
  console.log('\n[sync] Complete:', JSON.stringify(stats, null, 2))
}

main()
  .catch(err => { console.error('[sync] Fatal:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
