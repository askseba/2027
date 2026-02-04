/**
 * Quick Test: Header Component
 * 
 * هذا ملف اختبار سريع لـ Header الجديد
 * يمكن استخدامه كـ page مؤقتة للاختبار
 */

'use client'

import { useSession } from 'next-auth/react'
import Header from '@/components/ui/header'

export default function HeaderTestPage() {
  const { data: session, status } = useSession()

  return (
    <div>
      <Header />
      
      <div className="container mx-auto p-8" dir="rtl">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-brown-text mb-6">
            🧪 اختبار Header
          </h1>
          
          {/* Auth Status */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h2 className="font-bold text-lg mb-2">حالة المصادقة:</h2>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-semibold">Status:</span>
                <span className={
                  status === 'authenticated' ? 'text-green-600' :
                  status === 'unauthenticated' ? 'text-red-600' :
                  'text-yellow-600'
                }>
                  {status}
                </span>
              </div>
              
              {session && (
                <>
                  <div className="flex gap-2">
                    <span className="font-semibold">Name:</span>
                    <span>{session.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold">Email:</span>
                    <span>{session.user?.email || 'N/A'}</span>
                  </div>
                  {session.user?.image && (
                    <div className="flex gap-2">
                      <span className="font-semibold">Image:</span>
                      <span className="truncate">{session.user.image}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Test Checklist */}
          <div className="bg-green-50 rounded-xl p-4">
            <h2 className="font-bold text-lg mb-4">✅ قائمة الاختبار:</h2>
            
            <div className="space-y-3 text-sm">
              <div className="border-b border-green-200 pb-3">
                <h3 className="font-semibold mb-2">اختبارات الزوار (غير مسجّل):</h3>
                <ul className="space-y-1 mr-4">
                  <li>☐ الضغط على 🔔 → تحويل إلى /login?callbackUrl=/notifications</li>
                  <li>☐ الضغط على ❤️ → تحويل إلى /login?callbackUrl=/dashboard</li>
                  <li>☐ فتح 👤 menu → عرض "الدخول" و "التسجيل"</li>
                  <li>☐ الضغط على "الدخول" → تحويل إلى /login</li>
                </ul>
              </div>
              
              <div className="border-b border-green-200 pb-3">
                <h3 className="font-semibold mb-2">اختبارات المسجّلين:</h3>
                <ul className="space-y-1 mr-4">
                  <li>☐ الضغط على 🔔 → تحويل إلى /notifications</li>
                  <li>☐ الضغط على ❤️ → تحويل إلى /dashboard</li>
                  <li>☐ فتح 👤 menu → عرض "الملف الشخصي" و "تسجيل الخروج"</li>
                  <li>☐ عرض صورة profile في Avatar</li>
                  <li>☐ الضغط على "تسجيل الخروج" → signOut وتحويل إلى /</li>
                </ul>
              </div>
              
              <div className="border-b border-green-200 pb-3">
                <h3 className="font-semibold mb-2">اختبارات المفضلات:</h3>
                <ul className="space-y-1 mr-4">
                  <li>☐ إضافة عطر للمفضلة</li>
                  <li>☐ التحقق من تلوين القلب بالأحمر</li>
                  <li>☐ التحقق من ظهور النقطة الذهبية</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">اختبارات UI/UX:</h3>
                <ul className="space-y-1 mr-4">
                  <li>☐ hover:scale-105 يعمل على كل الأزرار</li>
                  <li>☐ RTL يعمل بشكل صحيح</li>
                  <li>☐ Backdrop blur يظهر عند scroll</li>
                  <li>☐ Responsive على mobile وdesktop</li>
                  <li>☐ Focus indicators واضحة</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold mb-3">🔗 روابط سريعة:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="/login" className="text-blue-600 hover:underline">
                → صفحة تسجيل الدخول
              </a>
              <a href="/register" className="text-blue-600 hover:underline">
                → صفحة التسجيل
              </a>
              <a href="/dashboard" className="text-blue-600 hover:underline">
                → Dashboard
              </a>
              <a href="/notifications" className="text-blue-600 hover:underline">
                → الإشعارات
              </a>
              <a href="/profile" className="text-blue-600 hover:underline">
                → الملف الشخصي
              </a>
              <a href="/results" className="text-blue-600 hover:underline">
                → نتائج العطور
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
