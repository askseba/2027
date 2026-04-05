-- AlterTable
ALTER TABLE "perfumes" ADD COLUMN "fragellaSlug" TEXT;

-- AlterTable
ALTER TABLE "prices" ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "listingUrl" TEXT;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN "discountCode" TEXT,
ADD COLUMN "discountExpiry" TIMESTAMP(3),
ADD COLUMN "discountLabel" TEXT,
ADD COLUMN "lastSyncAt" TIMESTAMP(3),
ADD COLUMN "logoUrl" TEXT,
ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "perfumes_fragellaSlug_key" ON "perfumes"("fragellaSlug");
