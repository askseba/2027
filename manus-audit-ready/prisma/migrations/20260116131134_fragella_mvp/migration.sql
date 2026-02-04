-- CreateTable
CREATE TABLE "fragella_perfumes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fragellaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandName" TEXT,
    "payloadJson" JSONB NOT NULL,
    "fetchedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "fragella_perfumes_fragellaId_key" ON "fragella_perfumes"("fragellaId");

-- CreateIndex
CREATE INDEX "fragella_perfumes_fragellaId_idx" ON "fragella_perfumes"("fragellaId");

-- CreateIndex
CREATE INDEX "fragella_perfumes_name_idx" ON "fragella_perfumes"("name");
