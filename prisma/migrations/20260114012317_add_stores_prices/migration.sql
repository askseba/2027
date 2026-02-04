-- CreateTable
CREATE TABLE "stores" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "affiliateUrl" TEXT NOT NULL,
    "commission" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "prices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "perfume_id" TEXT NOT NULL,
    "store_id" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "prices_perfume_id_fkey" FOREIGN KEY ("perfume_id") REFERENCES "perfumes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "prices_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_slug_key" ON "stores"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "prices_perfume_id_store_id_key" ON "prices"("perfume_id", "store_id");
