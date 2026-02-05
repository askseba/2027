import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

/** GET /api/feedback/suggestions - List suggestions with vote counts and hasVoted */
export async function GET() {
  try {
    const session = await auth()
    const userId = session?.user?.id ?? null

    const suggestions = await prisma.suggestion.findMany({
      orderBy: [{ votes: { _count: 'desc' } }, { createdAt: 'desc' }],
      include: {
        _count: { select: { votes: true } },
        ...(userId ? { votes: { where: { userId }, select: { id: true } } } : {}),
      },
    })

    const doneCount = await prisma.suggestion.count({
      where: { publicStatus: 'done' },
    })

    const list = suggestions.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      publicStatus: (s.publicStatus ?? 'planned') as 'planned' | 'in_progress' | 'under_review' | 'done',
      category: s.category,
      votes: s._count?.votes ?? 0,
      hasVoted: userId
        ? Array.isArray((s as { votes?: { id: string }[] }).votes) &&
          (s as { votes: { id: string }[] }).votes.length > 0
        : false,
      userId: s.userId,
      isMine: userId ? s.userId === userId : false,
    }))

    return NextResponse.json({ suggestions: list, doneCount })
  } catch (error) {
    logger.error('Feedback suggestions GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}

/** POST /api/feedback/suggestions - Create suggestion (auth required) */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized', message: 'يجب تسجيل الدخول لإرسال اقتراح' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const title = (body.title ?? '').toString().trim()
    const description = (body.description ?? '').toString().trim()
    const category = (body.category ?? 'general').toString().trim() || 'general'

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        title,
        description,
        category,
        userId: session.user.id,
        status: 'pending',
        publicStatus: 'planned',
      },
    })

    return NextResponse.json({
      success: true,
      suggestion: {
        id: suggestion.id,
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
        publicStatus: suggestion.publicStatus,
      },
      message: 'تم إرسال اقتراحك بنجاح! سيتم مراجعته قريباً 🎉',
    })
  } catch (error) {
    logger.error('Feedback suggestions POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create suggestion' },
      { status: 500 }
    )
  }
}
