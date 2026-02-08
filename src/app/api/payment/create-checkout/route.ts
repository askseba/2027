// Subscription Journey – create Moyasar checkout and optional CheckoutSession
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getMoyasarService } from '@/lib/payment/moyasar.service'
import logger from '@/lib/logger'

type Plan = 'monthly' | 'yearly'

/** POST /api/payment/create-checkout – body: { plan: 'monthly' | 'yearly' } */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول لبدء الاشتراك' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const plan = (body.plan ?? '').toString() as Plan
    if (plan !== 'monthly' && plan !== 'yearly') {
      return NextResponse.json(
        { success: false, error: 'خطة غير صالحة. اختر monthly أو yearly' },
        { status: 400 }
      )
    }

    const moyasar = getMoyasarService()
    const plans = moyasar.getPlans()
    const planConfig = plan === 'yearly' ? plans.yearly : plans.monthly
    const amount = planConfig.amount

    const { checkoutUrl, paymentId } = await moyasar.createCheckout({
      userId: session.user.id,
      plan,
      amount,
      userEmail: session.user.email,
      userName: session.user.name ?? undefined
    })

    // Optional: record checkout session for recovery (abandoned cart)
    try {
      await prisma.checkoutSession.create({
        data: {
          userId: session.user.id,
          email: session.user.email,
          status: 'initiated',
          plan,
          sessionId: paymentId,
          amount: planConfig.amount
        }
      })
    } catch (dbErr) {
      logger.warn('CheckoutSession create failed (non-blocking):', dbErr)
    }

    return NextResponse.json({
      success: true,
      checkoutUrl
    })
  } catch (err) {
    logger.error('Create checkout error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'فشل إنشاء جلسة الدفع'
      },
      { status: 500 }
    )
  }
}
