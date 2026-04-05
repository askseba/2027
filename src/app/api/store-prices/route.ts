// src/app/api/store-prices/route.ts
// GET /api/store-prices?fragellaSlug=creed-aventus
// Returns multi-store price comparison for a perfume
// Explicit mapping only — no name-based matching

import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export interface StorePriceItem {
  name: string
  slug: string
  price: number
  currency: string
  url: string // Final clickable purchase URL (built server-side)
  discountCode: string | null
  discountLabel: string | null
  discountExpiry: string | null // ISO date or null
  logoUrl: string | null
}

export interface StorePriceResponse {
  stores: StorePriceItem[]
  meta: {
    fragellaSlug: string
    count: number
    lastUpdated: string | null // ISO date or null if no prices
    status: 'not_indexed' | 'no_prices' | 'available'
  }
}

/**
 * Build the final purchase URL with tracking parameters.
 * listingUrl is the direct product page; we append UTM params if missing.
 */
function buildPurchaseUrl(listingUrl: string): string {
  try {
    const url = new URL(listingUrl)
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'askseba')
    }
    if (!url.searchParams.has('utm_medium')) {
      url.searchParams.set('utm_medium', 'pricehub')
    }
    return url.toString()
  } catch {
    // If URL parsing fails, return as-is
    return listingUrl
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fragellaSlug = searchParams.get('fragellaSlug')?.trim()

    if (!fragellaSlug) {
      return NextResponse.json(
        { error: 'fragellaSlug query parameter is required' },
        { status: 400 },
      )
    }

    // Step 1: Find Perfume by explicit fragellaSlug mapping
    const perfume = await prisma.perfume.findFirst({
      where: { fragellaSlug },
      select: { id: true },
    })

    // No mapping → empty result (UI shows Fragella fallback)
    if (!perfume) {
      console.log(`[PRICE_MISS] slug=${fragellaSlug} ts=${new Date().toISOString()}`)
      const response: StorePriceResponse = {
        stores: [],
        meta: { fragellaSlug, count: 0, lastUpdated: null, status: 'not_indexed' },
      }
      return NextResponse.json(response)
    }

    // Step 2: Fetch prices — only available, with listing URLs, from active stores
    const prices = await prisma.price.findMany({
      where: {
        perfumeId: perfume.id,
        isAvailable: true,
        listingUrl: { not: null },
        store: { isActive: true },
      },
      include: { store: true },
      orderBy: [
        { price: 'asc' },
        { store: { priority: 'desc' } },
      ],
    })

    // Step 3: Build response — final URL constructed here, not in frontend
    const stores: StorePriceItem[] = prices
      .filter((p) => p.listingUrl !== null)
      .map((p) => ({
        name: p.store.name,
        slug: p.store.slug,
        price: p.price,
        currency: p.currency,
        url: buildPurchaseUrl(p.listingUrl!),
        discountCode: p.store.discountCode ?? null,
        discountLabel: p.store.discountLabel ?? null,
        discountExpiry: p.store.discountExpiry?.toISOString() ?? null,
        logoUrl: p.store.logoUrl ?? null,
      }))

    // Step 4: lastUpdated = most recent Price.updatedAt
    const lastUpdated =
      prices.length > 0
        ? new Date(
            Math.max(...prices.map((p) => p.updatedAt.getTime())),
          ).toISOString()
        : null

    const response: StorePriceResponse = {
      stores,
      meta: {
        fragellaSlug,
        count: stores.length,
        lastUpdated,
        status: stores.length > 0 ? 'available' : 'no_prices',
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[store-prices] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
