'use client'
import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import logger from '@/lib/logger'

function SuccessContent() {
  const params = useSearchParams()
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkSubscription = async () => {
      const externalId = params.get('paymentId')
      
      if (!externalId) {
        setError('معرف الدفع غير موجود')
        setLoading(false)
        return
      }

      try {
        // ✅ P3-#1: Check subscription status from API
        const res = await fetch(`/api/user/subscription/${externalId}`)
        
        if (!res.ok) {
          if (res.status === 404) {
            // Subscription not found - redirect to pricing with error
            router.push('/pricing?error=unconfirmed')
            return
          }
          throw new Error('فشل في جلب بيانات الاشتراك')
        }

        const data = await res.json()
        
        // ✅ Only show success if subscription is ACTIVE
        if (data.status === 'ACTIVE') {
          setSubscription(data)
        } else {
          // Subscription not active - redirect to pricing with error
          router.push('/pricing?error=unconfirmed')
          return
        }
      } catch (err) {
        logger.error('Error checking subscription:', err)
        setError('حدث خطأ أثناء التحقق من الاشتراك')
        router.push('/pricing?error=unconfirmed')
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [params, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cream-bg flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brown-text">جاري التحقق من الاشتراك...</p>
        </div>
      </div>
    )
  }

  if (error || !subscription) {
    return null // Will redirect
  }

  const plan = subscription.plan === 'yearly' ? 'مميز سنوي' : 'مميز شهري'
  const price = subscription.amount

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cream-bg py-20 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto text-center">

        {/* Step 2 Complete */}
        <div className="flex items-center justify-center gap-2 mb-12" role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={2}>
          <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
          <div className="w-8 h-1 bg-gradient-to-r from-primary/30 to-primary/50 rounded-full" />
          <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" aria-current="step" />
        </div>

        {/* Success Check */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent mb-6">
          تم الاشتراك!
        </h1>

        <p className="text-2xl text-brown-text mb-2 font-semibold">باقتك: {plan}</p>
        <p className="text-xl text-brown-text/70 mb-12">
          {price} {subscription.currency}/شهر - بدء من اليوم
        </p>

        {subscription.currentPeriodEnd && (
          <p className="text-lg text-brown-text/60 mb-4">
            ينتهي في: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ar-SA')}
          </p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/')}
          className="w-full max-w-md mx-auto py-4 px-8 bg-gradient-to-r from-primary to-amber-600 text-white text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-8"
        >
          ابدأ استخدام Ask Seba
        </motion.button>

        <div className="text-sm text-brown-text/60 space-y-1">
          <p>✅ يمكنك إلغاء الاشتراك في أي وقت</p>
          <p>✅ ضمان استرجاع الأموال 7 أيام</p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 to-cream-bg flex items-center justify-center" dir="rtl">جاري التحميل...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
