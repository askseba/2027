'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/ui/header'
import { Footer } from '@/components/Footer'

const AUTH_PAGES = ['/login', '/register', '/forgot-password']

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = AUTH_PAGES.some((page) => pathname.endsWith(page))

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
