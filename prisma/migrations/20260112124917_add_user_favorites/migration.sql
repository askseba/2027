-- CreateTable
CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "publicStatus" TEXT DEFAULT 'planned',
    "userId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "votes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "suggestion_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "votes_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "suggestions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "perfumes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "baseScore" INTEGER NOT NULL DEFAULT 50,
    "scent_pyramid" TEXT,
    "families" TEXT NOT NULL DEFAULT '[]',
    "ingredients" TEXT NOT NULL DEFAULT '[]',
    "symptom_triggers" TEXT NOT NULL DEFAULT '[]',
    "isSafe" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'safe',
    "variant" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "liked_perfumes" TEXT NOT NULL DEFAULT '[]',
    "disliked_perfumes" TEXT NOT NULL DEFAULT '[]',
    "allergy_profile" TEXT NOT NULL DEFAULT '{}',
    "scent_dna" TEXT,
    "is_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "perfume_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "votes_suggestion_id_user_id_key" ON "votes"("suggestion_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_session_id_key" ON "user_preferences"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_user_id_perfume_id_key" ON "user_favorites"("user_id", "perfume_id");
