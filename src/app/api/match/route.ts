import { NextResponse } from 'next/server'
import { perfumes as rawPerfumes } from '@/lib/data/perfumes'
import type { PerfumeForMatching, ScoredPerfume } from '@/lib/matching'
import { calculateMatchScores } from '@/lib/matching'
import { getResultsLimit, getBlurredCount } from '@/lib/gating'

type Tier = 'GUEST' | 'FREE' | 'PREMIUM'

interface MatchRequestBody {
  preferences: {
    likedPerfumeIds: string[]
    dislikedPerfumeIds: string[]
    allergyProfile: {
      symptoms?: string[]
      families?: string[]
      ingredients?: string[]
    }
  }
}

function toPerfumeForMatching(p: {
  id: string
  name: string
  brand: string
  image: string
  description?: string
  price?: number
  families?: string[]
  ingredients?: string[]
  symptomTriggers?: string[]
  isSafe?: boolean
  status?: string
  variant?: string
}): PerfumeForMatching {
  const families = p.families ?? []
  const ingredients = p.ingredients ?? []
  const symptomTriggers = p.symptomTriggers ?? []
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    image: p.image,
    description: p.description ?? null,
    price: p.price ?? null,
    families,
    ingredients,
    symptomTriggers,
    isSafe: p.isSafe ?? true,
    status: p.status ?? 'safe',
    variant: p.variant ?? null,
    scentPyramid: null
  }
}

/** POST /api/match - Score perfumes by quiz preferences and return gated results */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MatchRequestBody
    const prefs = body?.preferences
    if (!prefs) {
      return NextResponse.json(
        { success: false, error: 'Missing preferences' },
        { status: 400 }
      )
    }

    const allergyProfile = {
      symptoms: prefs.allergyProfile?.symptoms ?? [],
      families: prefs.allergyProfile?.families ?? [],
      ingredients: prefs.allergyProfile?.ingredients ?? []
    }

    const allPerfumes: PerfumeForMatching[] = rawPerfumes.map(toPerfumeForMatching)
    const likedIds = prefs.likedPerfumeIds ?? []
    const likedPerfumesFamilies: string[] = []
    for (const id of likedIds) {
      const p = allPerfumes.find((x) => x.id === id)
      if (p?.families?.length) likedPerfumesFamilies.push(...p.families)
    }

    const userPreference = {
      likedPerfumesFamilies,
      dislikedPerfumeIds: prefs.dislikedPerfumeIds ?? [],
      allergyProfile
    }

    const scored: ScoredPerfume[] = calculateMatchScores(allPerfumes, userPreference)

    // Tier: GUEST when no auth; could be extended with getServerSession later
    const tier: Tier = 'GUEST'
    const limit = getResultsLimit(tier)
    const blurredCount = getBlurredCount(tier)

    const visible = scored.slice(0, limit)
    const blurred = scored.slice(limit, limit + blurredCount).map((p) => ({
      id: p.id,
      matchScore: p.finalScore,
      familyHint: p.families?.[0] ?? 'عطر'
    }))

    return NextResponse.json({
      success: true,
      perfumes: visible,
      blurredItems: blurred,
      tier
    })
  } catch (err) {
    console.error('Match API error:', err)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
