import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserTierInfo } from '@/lib/gating'
import logger from '@/lib/logger'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 })
    }

    const userId = session.user.id
    const tierInfo = await getUserTierInfo(userId)

    if (tierInfo.tier !== 'PREMIUM') {
      return NextResponse.json({ isPremium: false, vault: null })
    }

    const vault = await prisma.userVault.upsert({
      where:  { userId },
      create: { userId, activeCount: 0 },
      update: {},
    })

    return NextResponse.json({
      isPremium: true,
      vault: {
        activeCount:    vault.activeCount,
        diversityScore: vault.diversityScore,
      },
    })
  } catch (error) {
    logger.error('[vault GET]', error)
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 })
  }
}
