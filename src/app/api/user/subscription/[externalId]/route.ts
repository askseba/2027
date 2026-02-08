// Subscription Journey – get subscription by Moyasar payment id (for success page)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteParams = { params: Promise<{ externalId: string }> }

/** GET /api/user/subscription/[externalId] – returns subscription for success page (paymentId from URL) */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { externalId } = await params
    if (!externalId?.trim()) {
      return NextResponse.json(
        { error: 'معرف الدفع مطلوب' },
        { status: 400 }
      )
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { externalId: externalId.trim() },
          { moyasarPaymentId: externalId.trim() }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'الاشتراك غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      plan: subscription.plan,
      amount: subscription.amount,
      currency: subscription.currency,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? subscription.endDate.toISOString(),
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate.toISOString()
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'فشل في جلب بيانات الاشتراك' },
      { status: 500 }
    )
  }
}
