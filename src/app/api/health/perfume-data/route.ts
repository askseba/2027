import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/health/perfume-data
 * Health check endpoint for perfume data sources
 * Returns Fragella cache stats and fallback status
 */
export async function GET() {
  try {
    // Count Fragella cache entries
    const fragellaCacheCount = await prisma.fragellaCache.count()
    
    // Count Fragella perfumes in database
    const fragellaPerfumeCount = await prisma.fragellaPerfume.count()
    
    // Count local perfumes (fallback)
    const localPerfumeCount = await prisma.perfume.count()
    
    // Determine source status
    const hasFragellaData = fragellaCacheCount > 0 || fragellaPerfumeCount > 0
    const source = hasFragellaData ? 'fragella+ifra' : 'fallback'
    
    // Calculate fallback percentage (if using local perfumes)
    const totalPerfumes = fragellaPerfumeCount + localPerfumeCount
    const fallbackPct = totalPerfumes > 0 
      ? Math.round((localPerfumeCount / totalPerfumes) * 100) / 100
      : 0
    
    // Recommendation based on data availability
    let recommendation = 'ENRICH_NEEDED'
    if (fragellaCacheCount > 100 || fragellaPerfumeCount > 100) {
      recommendation = 'PRODUCTION'
    } else if (fragellaCacheCount > 0 || fragellaPerfumeCount > 0) {
      recommendation = 'PARTIAL'
    }
    
    return NextResponse.json({
      status: 'healthy',
      source,
      fragellaCacheCount,
      fragellaPerfumeCount,
      localPerfumeCount,
      fallbackPct,
      recommendation,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[health/perfume-data] Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to fetch perfume data health',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
