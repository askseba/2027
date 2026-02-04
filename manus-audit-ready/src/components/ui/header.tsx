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
import { StatusCircles } from "@/components/landing/StatusCircles"
import DarkModeToggle from "@/components/DarkModeToggle"
import { NotificationBellIcon, UserAvatarIcon } from "@/components/AskSebaIcons"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleNotificationsClick = () => {
    if (status === 'loading') return

    if (status === 'authenticated') {
      router.push('/notifications')
    } else {
      router.push('/login?callbackUrl=/notifications')
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-surface-elevated/60 border-b border-border-subtle"
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between sm:gap-3">
        <StatusCircles />
        <div className="flex items-center gap-2 sm:gap-3">
          <DarkModeToggle />

          {/* 🔔 Notifications Button — بجانب Avatar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNotificationsClick}
            disabled={status === 'loading'}
            className="relative hover:scale-105 transition-all duration-200"
            aria-label={status === 'authenticated' ? 'الإشعارات' : 'تسجيل الدخول للإشعارات'}
          >
            <NotificationBellIcon className="h-7 w-7" />
            {status === 'authenticated' && (
              <span className="absolute top-0.5 start-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </Button>

          {/* 👤 Account Hub - Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:scale-105 transition-all duration-200 p-1 h-auto rounded-full"
                aria-label="قائمة المستخدم"
              >
                <UserAvatarIcon className="h-7 w-7" />
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
