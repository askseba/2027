import { NextResponse } from 'next/server'
import { perfumes } from '@/lib/data/perfumes'

/** GET /api/perfumes - List all perfumes (e.g. for voice search fuzzy matching) */
export async function GET() {
  try {
    const list = perfumes.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      image: p.image,
    }))
    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list perfumes' },
      { status: 500 }
    )
  }
}
