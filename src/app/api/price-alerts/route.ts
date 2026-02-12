import { NextResponse } from 'next/server'

/**
 * Price alerts API stub.
 * POST: Create a price alert for a perfume (targetPrice = notify when price drops to this).
 * TODO: Persist to DB (user price alerts), enforce FREE=1 / PREMIUM=∞ limits.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { perfumeId, targetPrice } = body as { perfumeId?: string; targetPrice?: number }

    if (!perfumeId || typeof targetPrice !== 'number') {
      return NextResponse.json(
        { success: false, message: 'perfumeId and targetPrice are required' },
        { status: 400 }
      )
    }

    // TODO: Get session, save to DB, check tier limits (FREE=1, PREMIUM=∞)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    )
  }
}
