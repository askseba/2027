-- CreateTable
CREATE TABLE "fragella_cache" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "fragella_cache_key_key" ON "fragella_cache"("key");

-- CreateIndex
CREATE INDEX "fragella_cache_key_idx" ON "fragella_cache"("key");

-- CreateIndex
CREATE INDEX "fragella_cache_expiresAt_idx" ON "fragella_cache"("expiresAt");
