import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserTierInfo } from '@/lib/gating'
import logger from '@/lib/logger'
import { z } from 'zod'
import { Prisma, VaultPerfumeStatus } from '@prisma/client'
import { getPerfume } from '@/lib/services/perfume.service'
import { convertFragellaToUnified } from '@/lib/services/perfume-bridge.service'
import { normalizeFamily } from '@/lib/utils/family'
import { recalculateVaultAnalytics } from '@/lib/vault-analytics'

// ─── Schemas ─────────────────────────────────────────────────

const addPerfumeSchema = z.object({
  fragellaId:   z.string().min(1),
  fragellaSlug: z.string().min(1),
  status:       z.enum(['ACTIVE', 'PASSIVE', 'EXCLUDED']).optional().default('ACTIVE'),
})

// ─── Local types ─────────────────────────────────────────────

interface FragellaStage {
  stage: string
  notes: string[]
}

// ─── GET /api/vault/perfumes ─────────────────────────────────

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') ?? 'all'

    const vault = await prisma.userVault.findUnique({ where: { userId } })
    if (!vault) {
      return NextResponse.json({
        perfumes: [],
        counts: { all: 0, active: 0, passive: 0, excluded: 0 },
      })
    }

    const baseWhere        = { vaultId: vault.id }
    const statusFilter     =
      filter === 'active'
        ? { status: VaultPerfumeStatus.ACTIVE }
        : filter === 'other'
          ? { status: { in: [VaultPerfumeStatus.PASSIVE, VaultPerfumeStatus.EXCLUDED] } }
          : {}

    const [perfumes, all, active, passive, excluded] = await Promise.all([
      prisma.vaultPerfume.findMany({
        where:   { ...baseWhere, ...statusFilter },
        orderBy: { addedAt: 'desc' },
      }),
      prisma.vaultPerfume.count({ where: baseWhere }),
      prisma.vaultPerfume.count({ where: { ...baseWhere, status: VaultPerfumeStatus.ACTIVE } }),
      prisma.vaultPerfume.count({ where: { ...baseWhere, status: VaultPerfumeStatus.PASSIVE } }),
      prisma.vaultPerfume.count({ where: { ...baseWhere, status: VaultPerfumeStatus.EXCLUDED } }),
    ])

    return NextResponse.json({ perfumes, counts: { all, active, passive, excluded } })
  } catch (error) {
    logger.error('[vault/perfumes GET]', error)
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 })
  }
}

// ─── POST /api/vault/perfumes ────────────────────────────────

export async function POST(request: NextRequest) {
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

    const parsed = addPerfumeSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'البيانات غير صحيحة' }, { status: 400 })
    }

    const { fragellaId, fragellaSlug, status } = parsed.data

    const rawData = await getPerfume(fragellaId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unified = convertFragellaToUnified(rawData as any, fragellaId)
    if (!unified) {
      return NextResponse.json({ error: 'العطر غير موجود' }, { status: 404 })
    }

    // Extract pyramid notes — stages shape differs from TimelineStage interface at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stages     = (unified.stages ?? []) as unknown as FragellaStage[]
    const notesTop   = stages.find(s => s.stage === 'top')?.notes   ?? []
    const notesHeart = stages.find(s => s.stage === 'heart')?.notes ?? []
    const notesBase  = stages.find(s => s.stage === 'base')?.notes  ?? []

    const family          = normalizeFamily(unified.families?.[0]) || 'unknown'
    const familySecondary = unified.families?.[1]
      ? normalizeFamily(unified.families[1])
      : null

    const { vault, perfume } = await prisma.$transaction(async (tx) => {
      const vault = await tx.userVault.upsert({
        where:  { userId },
        create: { userId, activeCount: 0 },
        update: {},
      })

      const perfume = await tx.vaultPerfume.create({
        data: {
          vaultId: vault.id,
          fragellaId,
          fragellaSlug,
          name:     unified.name,
          brand:    unified.brand,
          imageUrl: unified.image,
          family,
          familySecondary,
          notesTop,
          notesHeart,
          notesBase,
          status:   status as VaultPerfumeStatus,
        },
      })

      if (perfume.status === VaultPerfumeStatus.ACTIVE) {
        await tx.userVault.update({
          where: { id: vault.id },
          data:  { activeCount: { increment: 1 } },
        })
      }

      return { vault, perfume }
    })

    await recalculateVaultAnalytics(vault.id)

    return NextResponse.json({ perfume })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json({ error: 'هذا العطر مضاف بالفعل' }, { status: 409 })
    }
    logger.error('[vault/perfumes POST]', error)
    return NextResponse.json({ error: 'حدث خطأ، حاول مجدداً' }, { status: 500 })
  }
}
