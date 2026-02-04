/**
 * مثال على كيفية دمج Header الجديد في ConditionalLayout
 * 
 * الخطوات:
 * 1. استبدل import Header القديم بالجديد
 * 2. الكود الموجود أدناه جاهز للاستخدام
 */

'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/ui/header'  // ← Header الجديد
import { Footer } from '@/components/Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? '' : 'flex-1'}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}
