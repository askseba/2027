// Subscription Journey – current user tier and subscription status (for profile)
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserTierInfo } from '@/lib/gating'

/** GET /api/user/tier – returns { tier, hasActiveSubscription, subscription? } */
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { tier: 'GUEST', hasActiveSubscription: false },
        { status: 200 }
      )
    }

    const tierInfo = await getUserTierInfo(session.user.id)
    const subscription = tierInfo.hasActiveSubscription
      ? await prisma.subscription.findFirst({
          where: {
            userId: session.user.id,
            status: 'ACTIVE',
            endDate: { gt: new Date() }
          },
          orderBy: { endDate: 'desc' },
          select: {
            plan: true,
            endDate: true,
            amount: true,
            currency: true,
            status: true
          }
        })
      : null

    return NextResponse.json({
      tier: tierInfo.tier,
      hasActiveSubscription: tierInfo.hasActiveSubscription,
      subscription: subscription
        ? {
            plan: subscription.plan,
            endDate: subscription.endDate.toISOString(),
            amount: subscription.amount,
            currency: subscription.currency,
            status: subscription.status
          }
        : null
    })
  } catch (err) {
    return NextResponse.json(
      { tier: 'FREE', hasActiveSubscription: false },
      { status: 200 }
    )
  }
}
