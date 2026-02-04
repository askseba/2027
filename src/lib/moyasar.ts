// ✅ P3-#1: Moyasar Webhook Signature Verification
// 🎯 Single source of truth for webhook signature verification

import crypto from 'crypto'
import logger from '@/lib/logger'

/**
 * Verify Moyasar webhook signature
 * @param payload - The webhook payload (can be object or string)
 * @param signature - The signature from webhook-signature header
 * @param secret - Optional secret (defaults to MOYASAR_WEBHOOK_SECRET env var)
 * @returns true if signature is valid
 */
export function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string = process.env.MOYASAR_WEBHOOK_SECRET!
): boolean {
  if (!secret) {
    logger.error('MOYASAR_WEBHOOK_SECRET is not configured')
    return false
  }

  if (!signature || signature.length === 0) {
    return false
  }

  try {
    // Convert payload to string if it's an object
    const payloadString = typeof payload === 'string' 
      ? payload 
      : JSON.stringify(payload)

    // Compute expected signature
    const expected = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex')

    // Constant-time comparison to prevent timing attacks
    if (expected.length !== signature.length) {
      return false
    }

    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(signature, 'hex')
    )
  } catch (error) {
    logger.error('Error verifying webhook signature:', error)
    return false
  }
}
