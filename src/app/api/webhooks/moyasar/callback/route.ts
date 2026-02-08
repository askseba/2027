// Subscription Journey – Moyasar payment callback: create Subscription, update User, send email
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMoyasarService } from '@/lib/payment/moyasar.service'
import { sendPaymentSuccessEmail } from '@/lib/email/email.service'
import logger from '@/lib/logger'
import { PaymentProvider, SubscriptionStatus } from '@prisma/client'

// Moyasar webhook body: { id, type, data?: { id, status, metadata, ... } }
interface MoyasarWebhookBody {
  id?: string
  type?: string
  data?: {
    id: string
    status?: string
    metadata?: { userId?: string; plan?: string; tier?: string }
    amount?: number
    [key: string]: unknown
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

/** POST /api/webhooks/moyasar/callback – verify signature, on payment_paid create Subscription + email */
export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature =
    request.headers.get('x-moyasar-signature') ??
    request.headers.get('X-Moyasar-Signature') ??
    request.headers.get('webhook-signature') ??
    ''

  const moyasar = getMoyasarService()
  if (!moyasar.verifyWebhookSignature(rawBody, signature)) {
    logger.warn('Moyasar webhook signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: MoyasarWebhookBody
  try {
    payload = JSON.parse(rawBody) as MoyasarWebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = payload.type ?? ''
  const data = payload.data
  if (!data?.id) {
    return NextResponse.json({ ok: true }) // 2xx so Moyasar doesn't retry
  }

  const paymentId = data.id
  const status = (data.status ?? '').toString().toLowerCase()
  const metadata = (data.metadata ?? {}) as { userId?: string; plan?: string }
  const userId = metadata.userId
  const plan = metadata.plan === 'yearly' ? 'yearly' : 'monthly'

  if (eventType === 'payment_paid' || status === 'paid') {
    if (!userId) {
      logger.warn('Moyasar callback: payment_paid but no userId in metadata', { paymentId })
      return NextResponse.json({ ok: true })
    }

    const amount = plan === 'yearly' ? 150 : 15
    const startDate = new Date()
    const endDate = plan === 'yearly' ? addMonths(startDate, 12) : addMonths(startDate, 1)

    try {
      await prisma.$transaction(async (tx) => {
        const existing = await tx.subscription.findFirst({
          where: {
            OR: [{ externalId: paymentId }, { moyasarPaymentId: paymentId }]
          }
        })
        if (existing) {
          logger.info('Moyasar callback: subscription already exists (idempotent)', { paymentId })
          return
        }

        await tx.subscription.create({
          data: {
            userId,
            tier: 'PREMIUM',
            status: SubscriptionStatus.ACTIVE,
            plan,
            startDate,
            endDate,
            provider: PaymentProvider.MOYASAR,
            externalId: paymentId,
            moyasarPaymentId: paymentId,
            lastPaymentDate: startDate,
            nextBillingDate: endDate,
            currentPeriodEnd: endDate,
            amount,
            currency: 'SAR'
          }
        })

        await tx.user.update({
          where: { id: userId },
          data: { subscriptionTier: 'PREMIUM' }
        })

        const checkoutSession = await tx.checkoutSession.findFirst({
          where: { sessionId: paymentId, userId }
        })
        if (checkoutSession) {
          await tx.checkoutSession.update({
            where: { id: checkoutSession.id },
            data: { status: 'completed' }
          })
        }
      })

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true }
      })
      if (user?.email) {
        const planName = plan === 'yearly' ? 'اشتراك سنوي' : 'اشتراك شهري'
        await sendPaymentSuccessEmail(user.email, {
          userName: user.name ?? 'مشترك',
          plan: planName,
          amount,
          currency: 'SAR',
          nextBillingDate: endDate,
          transactionId: paymentId
        })
      }
    } catch (err) {
      logger.error('Moyasar callback: DB/email error', err)
      return NextResponse.json(
        { error: 'Processing failed' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ ok: true })
}
