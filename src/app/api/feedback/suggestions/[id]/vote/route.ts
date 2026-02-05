import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

/** POST /api/feedback/suggestions/[id]/vote - Toggle vote (auth required) */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', votes: 0, hasVoted: false },
        { status: 401 }
      )
    }

    const { id: suggestionId } = await params
    if (!suggestionId) {
      return NextResponse.json(
        { error: 'Suggestion ID required', votes: 0, hasVoted: false },
        { status: 400 }
      )
    }

    const suggestion = await prisma.suggestion.findUnique({
      where: { id: suggestionId },
      include: { _count: { select: { votes: true } } },
    })
    if (!suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found', votes: 0, hasVoted: false },
        { status: 404 }
      )
    }

    const existing = await prisma.vote.findUnique({
      where: {
        suggestionId_userId: { suggestionId, userId: session.user.id },
      },
    })

    if (existing) {
      await prisma.vote.delete({
        where: { id: existing.id },
      })
      const newCount = suggestion._count.votes - 1
      return NextResponse.json({ votes: newCount, hasVoted: false })
    }

    await prisma.vote.create({
      data: {
        suggestionId,
        userId: session.user.id,
      },
    })
    const newCount = suggestion._count.votes + 1
    return NextResponse.json({ votes: newCount, hasVoted: true })
  } catch (error) {
    logger.error('Vote POST error:', error)
    return NextResponse.json(
      { error: 'Failed to vote', votes: 0, hasVoted: false },
      { status: 500 }
    )
  }
}
