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
import { StatusCircles } from "@/components/landing/StatusCircles"
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
      <div className="container mx-auto h-full px-4 flex items-center justify-between sm:gap-3">
        <StatusCircles />
        <div className="flex items-center gap-2 sm:gap-3">
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
      </div>
    </header>
  )
}
