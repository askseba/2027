// Prisma Client Singleton
// Prevents multiple instances in development

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper to parse JSON fields from SQLite
export function parsePerfumeFromDB(dbPerfume: {
  id: string
  name: string
  brand: string
  image: string
  description: string | null
  price: number | null
  baseScore: number
  scentPyramid?: string | null
  families: string
  ingredients: string
  symptomTriggers: string
  isSafe: boolean
  status: string
  variant: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: dbPerfume.id,
    name: dbPerfume.name,
    brand: dbPerfume.brand,
    image: dbPerfume.image,
    description: dbPerfume.description,
    price: dbPerfume.price,
    score: dbPerfume.baseScore,
    matchPercentage: dbPerfume.baseScore,
    scentPyramid: dbPerfume.scentPyramid != null ? JSON.parse(dbPerfume.scentPyramid) : null,
    families: JSON.parse(dbPerfume.families) as string[],
    ingredients: JSON.parse(dbPerfume.ingredients) as string[],
    symptomTriggers: JSON.parse(dbPerfume.symptomTriggers) as string[],
    isSafe: dbPerfume.isSafe,
    status: dbPerfume.status as 'safe' | 'warning' | 'danger',
    variant: dbPerfume.variant as 'on-sale' | 'just-arrived' | null,
  }
}
