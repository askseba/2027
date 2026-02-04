import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

/** Search API / local fallback response shape */
export interface SearchResultsResponse {
  results: unknown[]
}

/** Minimal shape for Fragella fragrance API response (used for cache upsert) */
interface FragranceApiPayload {
  name?: string
  brand?: { name?: string }
}

/** Safe parse of Prisma Json field (may be string or already object). Avoids cache corruption. */
function parseJsonField<T>(raw: unknown): T {
  if (typeof raw === 'string') {
    return JSON.parse(raw) as T
  }
  return raw as T
}

export async function getPerfume(fragellaId: string): Promise<unknown> {
  const now = new Date()
  
  const cached = await prisma.fragellaPerfume.findUnique({ where: { fragellaId } })
  if (cached && cached.expiresAt > now) {
    logger.info(`✅ CACHE HIT: ${cached.name}`)
    return parseJsonField(cached.payloadJson)
  }

  const apiKey = process.env.FRAGELLA_API_KEY
  if (!apiKey) {
    if (cached) {
      logger.warn(`⚠️ API KEY MISSING: Serving STALE ${fragellaId}`)
      return parseJsonField(cached.payloadJson)
    }
    throw new Error('FRAGELLA_API_KEY environment variable is not set')
  }

  logger.info(`🔄 CACHE MISS: ${fragellaId}`)
  const response = await fetch(`https://api.fragella.com/api/v1/fragrances/${fragellaId}`, {
    headers: { 'x-api-key': apiKey }
  })

  if (!response.ok) {
    if (cached) {
      logger.warn(`⚠️ API FAILED: Serving STALE ${fragellaId}`)
      return parseJsonField(cached.payloadJson)
    }
    const errorText = await response.text()
    throw new Error(`Fragella API: ${response.status} - ${errorText.substring(0, 200)}`)
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    await response.text()
    if (cached) {
      logger.warn(`⚠️ INVALID RESPONSE: Serving STALE ${fragellaId}`)
      return parseJsonField(cached.payloadJson)
    }
    throw new Error(`Invalid response format. Expected JSON, got: ${contentType}`)
  }

  const raw = await response.json() as unknown
  const payload = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? (raw as FragranceApiPayload) : ({} as FragranceApiPayload)
  const name = typeof payload.name === 'string' ? payload.name : 'Unknown'
  const brandName = (payload.brand && typeof payload.brand === 'object' && typeof payload.brand.name === 'string')
    ? payload.brand.name
    : 'Unknown'
  const fetchedAt = new Date()
  const expiresAt = new Date(fetchedAt.getTime() + CACHE_TTL_MS)

  const payloadJson = raw as Prisma.InputJsonValue
  await prisma.fragellaPerfume.upsert({
    where: { fragellaId },
    create: {
      fragellaId,
      name,
      brandName,
      payloadJson,
      fetchedAt,
      expiresAt
    },
    update: {
      name,
      brandName,
      payloadJson,
      fetchedAt,
      expiresAt
    }
  })

  logger.info(`💾 CACHED: ${name}`)
  return raw
}

/**
 * Search local perfumes as fallback when Fragella API is unavailable
 */
async function searchLocalPerfumes(query: string, limit: number): Promise<SearchResultsResponse> {
  try {
    const { perfumes } = await import('@/lib/data/perfumes')
    const results = perfumes
      .filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)

    return {
      results: results.map(p => ({
        ...p,
        source: 'local'
      }))
    }
  } catch (error) {
    logger.error('Local search fallback failed:', error)
    return { results: [] }
  }
}

export async function searchPerfumes(query: string, limit = 20): Promise<SearchResultsResponse> {
  const apiKey = process.env.FRAGELLA_API_KEY

  // If no API key, use local fallback
  if (!apiKey) {
    logger.warn('⚠️ FRAGELLA_API_KEY not set, using local search fallback')
    return searchLocalPerfumes(query, limit)
  }

  try {
    const response = await fetch(
      `https://api.fragella.com/api/v1/fragrances?search=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: { 'x-api-key': apiKey },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }
    )

    if (!response.ok) {
      logger.warn(`⚠️ Fragella API error (${response.status}), using local fallback`)
      return searchLocalPerfumes(query, limit)
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      logger.warn('⚠️ Invalid Fragella response format, using local fallback')
      return searchLocalPerfumes(query, limit)
    }

    const raw = await response.json() as unknown
    if (raw !== null && typeof raw === 'object' && 'results' in raw && Array.isArray((raw as SearchResultsResponse).results)) {
      return raw as SearchResultsResponse
    }
    return { results: [] }
  } catch (error) {
    logger.warn('⚠️ Fragella search error, falling back to local search', error)
    return searchLocalPerfumes(query, limit)
  }
}

export async function searchPerfumesWithCache<T = { results: unknown[] }>(query: string): Promise<T> {
  const cacheKey = `search:${query.toLowerCase()}`
  
  try {
    // Check cache
    const cached = await prisma.fragellaCache.findFirst({
      where: {
        key: cacheKey,
        expiresAt: { gt: new Date() }
      }
    })
    
    if (cached) {
      logger.info('✅ Cache HIT:', cacheKey)
      const data: T =
        typeof cached.data === 'string'
          ? (JSON.parse(String(cached.data)) as T)
          : (cached.data as T)
      return data
    }
    
    // Fetch fresh
    logger.info('🔄 Cache MISS - fetching:', cacheKey)
    const data = await searchPerfumes(query)
    
    // Cache for 24h
    try {
      await prisma.fragellaCache.upsert({
        where: { key: cacheKey },
        create: {
          key: cacheKey,
          data: JSON.stringify(data),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        update: {
          data: JSON.stringify(data),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })
    } catch (cacheError) {
      logger.warn('Failed to cache search results:', cacheError)
      // Continue anyway - cache failure should not break search
    }

    return data as T
  } catch (error) {
    logger.error('Search with cache failed:', error)
    // Last resort: return empty results instead of crashing
    return { results: [] } as T
  }
}
