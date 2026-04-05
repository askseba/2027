-- CreateEnum
CREATE TYPE "VaultPerfumeStatus" AS ENUM ('ACTIVE', 'PASSIVE', 'EXCLUDED');

-- AlterTable: add vault relation to users (no column needed, relation is on UserVault side)

-- CreateTable
CREATE TABLE "user_vaults" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeCount" INTEGER NOT NULL DEFAULT 0,
    "diversityScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_vaults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_perfumes" (
    "id" TEXT NOT NULL,
    "vaultId" TEXT NOT NULL,
    "fragellaId" TEXT NOT NULL,
    "fragellaSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "imageUrl" TEXT,
    "family" TEXT NOT NULL,
    "familySecondary" TEXT,
    "notesTop" TEXT[],
    "notesHeart" TEXT[],
    "notesBase" TEXT[],
    "status" "VaultPerfumeStatus" NOT NULL DEFAULT 'ACTIVE',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_perfumes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_vaults_userId_key" ON "user_vaults"("userId");

-- CreateIndex
CREATE INDEX "user_vaults_userId_idx" ON "user_vaults"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vault_perfumes_vaultId_fragellaId_key" ON "vault_perfumes"("vaultId", "fragellaId");

-- CreateIndex
CREATE INDEX "vault_perfumes_vaultId_idx" ON "vault_perfumes"("vaultId");

-- CreateIndex
CREATE INDEX "vault_perfumes_vaultId_status_idx" ON "vault_perfumes"("vaultId", "status");

-- AddForeignKey
ALTER TABLE "user_vaults" ADD CONSTRAINT "user_vaults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vault_perfumes" ADD CONSTRAINT "vault_perfumes_vaultId_fkey" FOREIGN KEY ("vaultId") REFERENCES "user_vaults"("id") ON DELETE CASCADE ON UPDATE CASCADE;
