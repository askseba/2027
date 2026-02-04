// MOYASAR ADDON - File 4/8: src/lib/email/email.service.ts
// ✅ COMPLETE EMAIL SERVICE
// 🎯 Send payment emails, price alerts, subscription notifications

import { Resend } from 'resend'
import logger from '@/lib/logger'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
  to: string,
  details: {
    userName: string
    plan: string
    amount: number
    currency: string
    nextBillingDate: Date
    transactionId: string
  }
) {
  const { userName, plan, amount, currency, nextBillingDate, transactionId } = details
  
  const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, var(--color-text-primary) 0%, #D2691E 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .success-icon { font-size: 64px; margin-bottom: 16px; }
    .content { padding: 40px 30px; }
    .details { background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #666; font-weight: 600; }
    .value { color: #333; font-weight: bold; }
    .cta-button { display: inline-block; background: var(--color-text-primary); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✅</div>
      <h1>تم الدفع بنجاح!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #333;">مرحباً ${userName}،</p>
      
      <p style="color: #666; line-height: 1.6;">
        شكراً لك على الاشتراك في Ask Seba Premium! تم تفعيل اشتراكك بنجاح وأصبح بإمكانك الآن الاستمتاع بجميع المميزات.
      </p>
      
      <div class="details">
        <div class="detail-row">
          <span class="label">الخطة:</span>
          <span class="value">${plan}</span>
        </div>
        <div class="detail-row">
          <span class="label">المبلغ المدفوع:</span>
          <span class="value">${amount} ${currency}</span>
        </div>
        <div class="detail-row">
          <span class="label">تاريخ التجديد:</span>
          <span class="value">${nextBillingDate.toLocaleDateString('ar-SA')}</span>
        </div>
        <div class="detail-row">
          <span class="label">رقم العملية:</span>
          <span class="value">${transactionId}</span>
        </div>
      </div>
      
      <p style="color: #666; line-height: 1.6;">
        <strong>ماذا يمكنك الآن؟</strong><br/>
        ✨ اختبارات غير محدودة<br/>
        🎯 12 نتيجة لكل اختبار<br/>
        💰 مقارنة الأسعار من عدة متاجر<br/>
        🔔 تنبيهات أسعار غير محدودة<br/>
        📊 سجل اختباراتك الكامل
      </p>
      
      <center>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
          ابدأ الآن
        </a>
      </center>
    </div>
    
    <div class="footer">
      <p>هذه رسالة آلية من Ask Seba</p>
      <p>إذا كانت لديك أي استفسارات، تواصل معنا على support@askseba.com</p>
    </div>
  </div>
</body>
</html>
  `
  
  if (!resend) {
    logger.warn('Resend API key not configured, skipping email')
    return
  }
  
  try {
    await resend.emails.send({
      from: 'Ask Seba <noreply@askseba.com>',
      to,
      subject: '✅ تم تفعيل اشتراكك في Ask Seba Premium',
      html: emailHtml
    })
    
    logger.info('Payment success email sent to:', to)
  } catch (error) {
    logger.error('Failed to send payment success email:', error)
    // Don't throw - email failure shouldn't break the flow
  }
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailedEmail(
  to: string,
  details: {
    userName: string
    reason: string
    supportEmail?: string
    retryUrl?: string
  }
) {
  const { userName, reason, supportEmail = 'support@askseba.com', retryUrl } = details
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://askseba.com'
  const finalRetryUrl = retryUrl || `${appUrl}/pricing`
  
  const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .error-icon { font-size: 64px; margin-bottom: 16px; }
    .content { padding: 40px 30px; }
    .alert-box { background: #fef2f2; border-right: 4px solid #dc2626; padding: 16px; margin: 24px 0; border-radius: 8px; }
    .cta-button { display: inline-block; background: var(--color-text-primary); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="error-icon">❌</div>
      <h1>فشلت عملية الدفع</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #333;">مرحباً ${userName}،</p>
      
      <p style="color: #666; line-height: 1.6;">
        نأسف لإبلاغك بأن عملية الدفع لم تكتمل بنجاح.
      </p>
      
      <div class="alert-box">
        <strong>سبب الفشل:</strong><br/>
        ${reason}
      </div>
      
      <p style="color: #666; line-height: 1.6;">
        <strong>ماذا يمكنك فعله؟</strong><br/>
        • تأكد من صحة معلومات البطاقة<br/>
        • تأكد من وجود رصيد كافٍ<br/>
        • جرب بطاقة أخرى<br/>
        • تواصل مع البنك لتفعيل المعاملات الإلكترونية
      </p>
      
      <center>
        <a href="${finalRetryUrl}" class="cta-button">
          حاول مرة أخرى
        </a>
      </center>
      
      <p style="color: #999; font-size: 14px; text-align: center;">
        إذا استمرت المشكلة، تواصل معنا على ${supportEmail}
      </p>
    </div>
    
    <div class="footer">
      <p>هذه رسالة آلية من Ask Seba</p>
    </div>
  </div>
</body>
</html>
  `
  
  if (!resend) {
    logger.warn('Resend API key not configured, skipping email')
    return
  }
  
  try {
    await resend.emails.send({
      from: 'Ask Seba <noreply@askseba.com>',
      to,
      subject: 'فشل الدفع - حاول مرة أخرى',
      html: emailHtml
    })
    
    logger.info('Payment failed email sent to:', to)
  } catch (error) {
    logger.error('Failed to send payment failed email:', error)
  }
}

/**
 * Send price drop alert email
 */
export async function sendPriceDropEmail(
  to: string,
  details: {
    userName: string
    perfumeName: string
    perfumeBrand: string
    oldPrice: number
    newPrice: number
    currency: string
    perfumeUrl: string
    retailer: string
  }
) {
  const { userName, perfumeName, perfumeBrand, oldPrice, newPrice, currency, perfumeUrl, retailer } = details
  const savings = oldPrice - newPrice
  const discount = Math.round((savings / oldPrice) * 100)
  
  const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .alert-icon { font-size: 64px; margin-bottom: 16px; }
    .content { padding: 40px 30px; }
    .price-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .old-price { text-decoration: line-through; color: #999; font-size: 18px; }
    .new-price { color: #10b981; font-size: 32px; font-weight: bold; margin: 8px 0; }
    .discount-badge { background: #dc2626; color: white; padding: 6px 16px; border-radius: 20px; display: inline-block; font-weight: bold; margin-top: 8px; }
    .cta-button { display: inline-block; background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="alert-icon">🎉</div>
      <h1>انخفض السعر!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #333;">مرحباً ${userName}،</p>
      
      <p style="color: #666; line-height: 1.6;">
        خبر سار! العطر الذي تتابعه انخفض سعره الآن:
      </p>
      
      <h2 style="color: #333; margin: 24px 0 8px;">${perfumeName}</h2>
      <p style="color: #999; margin: 0;">${perfumeBrand}</p>
      
      <div class="price-box">
        <div class="old-price">السعر السابق: ${oldPrice} ${currency}</div>
        <div class="new-price">${newPrice} ${currency}</div>
        <div class="discount-badge">وفّر ${savings} ${currency} (${discount}%)</div>
        <p style="color: #666; margin-top: 16px; font-size: 14px;">متوفر في ${retailer}</p>
      </div>
      
      <center>
        <a href="${perfumeUrl}" class="cta-button">
          اشترِ الآن 🛒
        </a>
      </center>
      
      <p style="color: #999; font-size: 14px; text-align: center;">
        الأسعار قد تتغير في أي وقت. أسرع للحصول على أفضل سعر!
      </p>
    </div>
    
    <div class="footer">
      <p>هذه رسالة آلية من نظام تنبيهات الأسعار في Ask Seba</p>
      <p>لإلغاء التنبيهات، قم بزيارة <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">لوحة التحكم</a></p>
    </div>
  </div>
</body>
</html>
  `
  
  if (!resend) {
    logger.warn('Resend API key not configured, skipping email')
    return
  }
  
  try {
    await resend.emails.send({
      from: 'Ask Seba <alerts@askseba.com>',
      to,
      subject: `🎉 انخفض سعر ${perfumeName}!`,
      html: emailHtml
    })
    
    logger.info('Price drop email sent to:', to)
  } catch (error) {
    logger.error('Failed to send price drop email:', error)
  }
}

/**
 * ✅ P3-#2: Send checkout recovery email
 * Sent to users who abandoned checkout (>1h old)
 */
export async function sendRecoveryEmail(
  email: string,
  plan: string,
  sessionId: string
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://askseba.com'
  const recoverUrl = `${appUrl}/pricing?recover=${sessionId}`
  const planName = plan === 'monthly' ? 'الاشتراك الشهري' : 'الاشتراك السنوي'
  
  const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, var(--color-text-primary) 0%, #D2691E 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .gift-icon { font-size: 64px; margin-bottom: 16px; }
    .content { padding: 40px 30px; }
    .highlight-box { background: #fff7ed; border-right: 4px solid #D2691E; padding: 20px; margin: 24px 0; border-radius: 8px; }
    .cta-button { display: inline-block; background: var(--color-text-primary); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: bold; font-size: 18px; }
    .guarantee { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 16px; margin: 24px 0; text-align: center; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="gift-icon">🎁</div>
      <h1>أكمل اشتراكك في Ask Seba!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #333;">مرحباً،</p>
      
      <p style="color: #666; line-height: 1.6;">
        لاحظنا أنك بدأت عملية الاشتراك في ${planName} ولكن لم تكملها. لا تقلق، يمكنك إكمالها الآن بسهولة!
      </p>
      
      <div class="highlight-box">
        <p style="margin: 0; color: #333; font-weight: bold;">
          ✨ استمتع بجميع مميزات Premium:<br/>
          • اختبارات غير محدودة<br/>
          • 12 نتيجة لكل اختبار<br/>
          • مقارنة أسعار شاملة<br/>
          • تنبيهات أسعار غير محدودة<br/>
          • سجل اختباراتك الكامل
        </p>
      </div>
      
      <center>
        <a href="${recoverUrl}" class="cta-button">
          إكمال الاشتراك الآن →
        </a>
      </center>
      
      <div class="guarantee">
        <p style="margin: 0; color: #059669; font-weight: bold; font-size: 16px;">
          💎 ضمان استرجاع الأموال 7 أيام
        </p>
        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">
          إذا لم تكن راضياً، سنعيد لك المبلغ كاملاً دون أسئلة
        </p>
      </div>
      
      <p style="color: #999; font-size: 14px; text-align: center; margin-top: 32px;">
        هذه الرسالة ستنتهي صلاحيتها قريباً. أسرع لإكمال اشتراكك!
      </p>
    </div>
    
    <div class="footer">
      <p>هذه رسالة آلية من Ask Seba</p>
      <p>إذا كانت لديك أي استفسارات، تواصل معنا على support@askseba.com</p>
    </div>
  </div>
</body>
</html>
  `
  
  if (!resend) {
    logger.warn('Resend API key not configured, skipping recovery email')
    return
  }
  
  try {
    await resend.emails.send({
      from: 'Ask Seba <noreply@askseba.com>',
      to: email,
      subject: '🎁 أكمل اشتراكك في Ask Seba!',
      html: emailHtml
    })
    
    logger.info('Recovery email sent to:', { email, sessionId })
  } catch (error) {
    logger.error('Failed to send recovery email:', error)
    throw error // Re-throw so cron can track errors
  }
}

/**
 * Send subscription renewal reminder
 */
export async function sendRenewalReminderEmail(
  to: string,
  details: {
    userName: string
    plan: string
    amount: number
    renewalDate: Date
  }
) {
  const { userName, plan, amount, renewalDate } = details
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
  const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .content { padding: 40px 30px; }
    .info-box { background: #eff6ff; border-right: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 8px; }
    .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #999; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>تذكير بتجديد الاشتراك</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #333;">مرحباً ${userName}،</p>
      
      <p style="color: #666; line-height: 1.6;">
        هذا تذكير بأن اشتراكك في Ask Seba Premium سيتجدد قريباً.
      </p>
      
      <div class="info-box">
        <strong>تفاصيل التجديد:</strong><br/>
        • الخطة: ${plan}<br/>
        • المبلغ: ${amount} ريال<br/>
        • تاريخ التجديد: ${renewalDate.toLocaleDateString('ar-SA')}<br/>
        • المتبقي: ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'يوم' : 'أيام'}
      </div>
      
      <p style="color: #666; line-height: 1.6;">
        سيتم خصم المبلغ تلقائياً من وسيلة الدفع المسجلة لديك.
      </p>
      
      <center>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription" class="cta-button">
          إدارة الاشتراك
        </a>
      </center>
      
      <p style="color: #999; font-size: 14px; text-align: center;">
        لإلغاء الاشتراك أو تغيير الخطة، قم بزيارة لوحة التحكم
      </p>
    </div>
    
    <div class="footer">
      <p>هذه رسالة آلية من Ask Seba</p>
    </div>
  </div>
</body>
</html>
  `
  
  if (!resend) {
    logger.warn('Resend API key not configured, skipping email')
    return
  }
  
  try {
    await resend.emails.send({
      from: 'Ask Seba <noreply@askseba.com>',
      to,
      subject: `⏰ سيتجدد اشتراكك في Ask Seba خلال ${daysUntilRenewal} ${daysUntilRenewal === 1 ? 'يوم' : 'أيام'}`,
      html: emailHtml
    })
    
    logger.info('Renewal reminder email sent to:', to)
  } catch (error) {
    logger.error('Failed to send renewal reminder email:', error)
  }
}
