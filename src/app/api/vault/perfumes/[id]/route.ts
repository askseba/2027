import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserTierInfo } from '@/lib/gating'
import logger from '@/lib/logger'
import { z } from 'zod'
import { VaultPerfumeStatus } from '@prisma/client'
import { recalculateVaultAnalytics } from '@/lib/vault-analytics'

// ─── Route params (Next.js 16 — params is a Promise) ─────────

type RouteParams = { params: Promise<{ id: string }> }

// ─── Schema ───────────────────────────────────────────────────

const patchSchema = z.object({
  status: z.enum(['ACTIVE', 'PASSIVE', 'EXCLUDED']),
})

// ─── PATCH /api/vault/perfumes/[id] ──────────────────────────

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 })
    }

    const userId = session.user.id
    const tierInfo = await getUserTierInfo(userId)
    if (tierInfo.tier !== 'PREMIUM') {
      return NextResponse.json({ error: 'هذه الميزة للمشتركين' }, { status: 403 })
    }

    const { id } = await params

    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'البيانات غير صحيحة' }, { status: 400 })
    }

    const perfume = await prisma.vaultPerfume.findUnique({
      where:   { id },
      include: { vault: { select: { id: true, userId: true } } },
    })

    if (!perfume || perfume.vault.userId !== userId) {
      return NextResponse.json({ error: 'العطر غير موجود' }, { status: 404 })
    }

    const vaultId      = perfume.vault.id
    const wasActive    = perfume.status === VaultPerfumeStatus.ACTIVE
    const newStatus    = parsed.data.status as VaultPerfumeStatus
    const willBeActive = newStatus === VaultPerfumeStatus.ACTIVE

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.vaultPerfume.update({
        where: { id },
        data:  { status: newStatus },
      })

      if (wasActive && !willBeActive) {
        await tx.userVault.update({
          where: { id: vaultId },
          data:  { activeCount: { decrement: 1 } },
        })
      } else if (!wasActive && willBeActive) {
        await tx.userVault.update({
          where: { id: vaultId },
          data:  { activeCount: { increment: 1 } },
        })
      }

      return result
    })

    recalculateVaultAnalytics(vaultId).catch((err: unknown) => {
      logger.error('[vault/perfumes PATCH] recalculate failed', err)
    })

    return NextResponse.json({ perfume: updated })
  } catch (error) {
    logger.error('[vault/perfumes PATCH]', error)
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 })
  }
}

// ─── DELETE /api/vault/perfumes/[id] ─────────────────────────

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'يرجى تسجيل الدخول' }, { status: 401 })
    }

    const userId = session.user.id
    const tierInfo = await getUserTierInfo(userId)
    if (tierInfo.tier !== 'PREMIUM') {
      return NextResponse.json({ error: 'هذه الميزة للمشتركين' }, { status: 403 })
    }

    const { id } = await params

    const perfume = await prisma.vaultPerfume.findUnique({
      where:   { id },
      include: { vault: { select: { id: true, userId: true } } },
    })

    if (!perfume || perfume.vault.userId !== userId) {
      return NextResponse.json({ error: 'العطر غير موجود' }, { status: 404 })
    }

    const vaultId   = perfume.vault.id
    const wasActive = perfume.status === VaultPerfumeStatus.ACTIVE

    await prisma.$transaction(async (tx) => {
      await tx.vaultPerfume.delete({ where: { id } })
      if (wasActive) {
        await tx.userVault.update({
          where: { id: vaultId },
          data:  { activeCount: { decrement: 1 } },
        })
      }
    })

    recalculateVaultAnalytics(vaultId).catch((err: unknown) => {
      logger.error('[vault/perfumes DELETE] recalculate failed', err)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[vault/perfumes DELETE]', error)
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 })
  }
}
