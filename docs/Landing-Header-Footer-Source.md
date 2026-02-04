# الصفحة الرئيسية + Header + Footer + ConditionalLayout — مصدر كامل

ملف واحد يجمع المكوّنات الفعلية للصفحة الرئيسية والهيدر والفوتر والـ layout الذي يحقنها.

---

## 1) ConditionalLayout (يحقن Header و Footer)

**المسار:** `src/components/ConditionalLayout.tsx`

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/ui/header'
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
```

---

## 2) Header component

**المسار:** `src/components/ui/header.tsx`

```tsx
"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart } from "lucide-react"
import { useFavorites } from "@/hooks/useFavorites"
import ThemeToggle from "@/components/ThemeToggle"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { favorites } = useFavorites()

  const handleNotificationsClick = () => {
    if (status === 'loading') return
    
    if (status === 'authenticated') {
      router.push('/notifications')
    } else {
      router.push('/login?callbackUrl=/notifications')
    }
  }

  const handleFavoritesClick = () => {
    if (status === 'loading') return
    
    if (status === 'authenticated') {
      router.push('/dashboard')
    } else {
      router.push('/login?callbackUrl=/dashboard')
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const hasFavorites = favorites.length > 0

  return (
    <header 
      dir="rtl" 
      className="sticky top-0 z-50 h-14 bg-background/95 dark:bg-[color:var(--surface-elevated)]/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-[color:var(--surface-elevated)]/60 border-b border-[color:var(--border-subtle)]"
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-end gap-2 sm:gap-3">
        {/* 🔔 Notifications Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleNotificationsClick}
          disabled={status === 'loading'}
          className="relative hover:scale-105 transition-all duration-200"
          aria-label={status === 'authenticated' ? 'الإشعارات' : 'تسجيل الدخول للإشعارات'}
        >
          <Bell className="h-5 w-5" />
          {status === 'authenticated' && (
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>

        {/* ❤️ Favorites Button */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleFavoritesClick}
          disabled={status === 'loading'}
          className="relative hover:scale-105 transition-all duration-200"
          aria-label={status === 'authenticated' ? 'المفضلة' : 'تسجيل الدخول للمفضلة'}
        >
          <Heart 
            className={`h-5 w-5 ${hasFavorites ? 'fill-red-500 text-red-500' : ''}`}
          />
          {hasFavorites && (
            <span className="absolute top-1 left-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>

        <ThemeToggle />

        {/* 👤 Account Hub - Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="relative hover:scale-105 transition-all duration-200 p-1 h-auto rounded-full"
              aria-label="قائمة المستخدم"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={session?.user?.image || undefined} 
                  alt={session?.user?.name || 'المستخدم'} 
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm dark:text-text-primary">
                  👤
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="start" 
            className="w-48"
          >
            {session ? (
              // Authenticated User Menu
              <>
                <DropdownMenuItem
                  onClick={() => router.push('/profile')}
                  className="cursor-pointer text-right"
                >
                  الملف الشخصي
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-right text-red-600 focus:text-red-600"
                >
                  تسجيل الخروج
                </DropdownMenuItem>
              </>
            ) : (
              // Guest User Menu
              <>
                <DropdownMenuItem
                  onClick={() => router.push('/login')}
                  className="cursor-pointer text-right"
                >
                  الدخول
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => router.push('/register')}
                  className="cursor-pointer text-right"
                >
                  التسجيل
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

---

## 3) Footer component

**المسار:** `src/components/Footer.tsx`

```tsx
import Link from 'next/link'
import { Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer
      dir="rtl"
      className="bg-white dark:bg-surface border-t border-border-subtle py-6 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* 4 CTA row */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-6"
          aria-label="روابط مهمة"
        >
          <Link
            href="/about"
            className="min-touch-target inline-flex items-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
          >
            قصتنا
          </Link>
          <Link
            href="/faq"
            className="min-touch-target inline-flex items-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
          >
            تساؤلات
          </Link>
          <Link
            href="/privacy"
            className="min-touch-target inline-flex items-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
          >
            الخصوصية
          </Link>
          <Link
            href="/feedback"
            className="min-touch-target inline-flex items-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
          >
            شاركنا رأيك
          </Link>
        </nav>

        {/* Icons row */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="mailto:support@askseba.com"
            className="min-touch-target flex items-center justify-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
            aria-label="تواصل معنا بالبريد الإلكتروني"
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://instagram.com/askseba"
            target="_blank"
            rel="noopener noreferrer"
            className="min-touch-target flex items-center justify-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
            aria-label="تابعنا على إنستغرام"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
          </a>
          <a
            href="https://twitter.com/askseba"
            target="_blank"
            rel="noopener noreferrer"
            className="min-touch-target flex items-center justify-center text-text-secondary hover:text-primary dark:hover:text-accent-primary transition-colors touch-manipulation"
            aria-label="تابعنا على تويتر"
          >
            <Twitter className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-border-subtle pt-4 text-center">
          <p className="text-text-secondary dark:text-text-muted text-sm">
            © {new Date().getFullYear()} Ask Seba. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

## 4) Landing page — page.tsx (يجمع الأقسام)

**المسار:** `src/app/page.tsx`

```tsx
import { HeroSection } from '@/components/landing/HeroSection';
import { QuestionsSection } from '@/components/landing/QuestionsSection';
import { CTASection } from '@/components/landing/CTASection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <HeroSection />
      <QuestionsSection />
      <CTASection />
    </main>
  );
}
```

---

## ملخص الربط

| المكوّن | المسار | يُستدعى من |
|---------|--------|------------|
| **ConditionalLayout** | `src/components/ConditionalLayout.tsx` | `src/app/layout.tsx` يلف `{children}` به |
| **Header** | `src/components/ui/header.tsx` | `ConditionalLayout` (عند عدم صفحة تسجيل دخول/تسجيل) |
| **Footer** | `src/components/Footer.tsx` | `ConditionalLayout` (نفس الشرط) |
| **Landing page** | `src/app/page.tsx` | Next.js للمسار `/` — محتواه يمر كـ `children` داخل `ConditionalLayout` |

على الصفحة الرئيسية `/`: يظهر **Header** ثم محتوى **page.tsx** (HeroSection → QuestionsSection → CTASection) ثم **Footer**.
