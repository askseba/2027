-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ifra_materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "casNumber" TEXT,
    "maxConcentration" REAL NOT NULL DEFAULT 0.01,
    "unit" TEXT NOT NULL DEFAULT 'percent',
    "category" TEXT NOT NULL,
    "euRegulation" TEXT NOT NULL DEFAULT 'EU 2023/1545',
    "amendmentVersion" TEXT NOT NULL DEFAULT 'IFRA 51',
    "productCategory" INTEGER NOT NULL DEFAULT 4,
    "symptoms" TEXT NOT NULL DEFAULT '[]',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "symptom_ingredient_mappings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symptom" TEXT NOT NULL,
    "symptomAr" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "confidence" REAL NOT NULL DEFAULT 0.5,
    "severity" TEXT NOT NULL DEFAULT 'moderate',
    "evidenceLevel" TEXT NOT NULL DEFAULT 'moderate',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "symptom_ingredient_mappings_ingredient_fkey" FOREIGN KEY ("ingredient") REFERENCES "ifra_materials" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "perfume_ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fragellaId" TEXT NOT NULL,
    "ingredientName" TEXT NOT NULL,
    "detectedFrom" TEXT NOT NULL,
    "isAllergen" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "perfume_ingredients_ingredientName_fkey" FOREIGN KEY ("ingredientName") REFERENCES "ifra_materials" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "perfumeId" TEXT NOT NULL,
    "targetPrice" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "lastChecked" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PriceAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'PREMIUM',
    "status" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT,
    "paymentMethodId" TEXT,
    "moyasarPaymentId" TEXT,
    "moyasarCustomerId" TEXT,
    "moyasarSourceId" TEXT,
    "lastPaymentDate" DATETIME,
    "nextBillingDate" DATETIME,
    "trialEndsAt" DATETIME,
    "currentPeriodEnd" DATETIME,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "canceledAt" DATETIME,
    "cancelReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TestHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "likedPerfumes" TEXT NOT NULL,
    "dislikedPerfumes" TEXT NOT NULL,
    "allergySymptoms" TEXT NOT NULL,
    "allergyFamilies" TEXT NOT NULL,
    "totalMatches" INTEGER NOT NULL,
    "topMatchId" TEXT,
    "topMatchScore" REAL,
    "scentDNA" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TestHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConversionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "fromTier" TEXT,
    "toTier" TEXT,
    "page" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "checkout_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "sessionId" TEXT,
    "amount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "recoveryEmailSentAt" DATETIME,
    "recoveryEmailCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "checkout_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "stats_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" DATETIME,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
    "monthlyTestCount" INTEGER NOT NULL DEFAULT 0,
    "lastTestReset" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("bio", "created_at", "email", "email_verified", "id", "image", "name", "password", "role", "stats_verified", "updated_at") SELECT "bio", "created_at", "email", "email_verified", "id", "image", "name", "password", "role", "stats_verified", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_subscriptionTier_monthlyTestCount_idx" ON "users"("subscriptionTier", "monthlyTestCount");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "ifra_materials_name_key" ON "ifra_materials"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ifra_materials_casNumber_key" ON "ifra_materials"("casNumber");

-- CreateIndex
CREATE INDEX "symptom_ingredient_mappings_symptom_idx" ON "symptom_ingredient_mappings"("symptom");

-- CreateIndex
CREATE INDEX "symptom_ingredient_mappings_ingredient_idx" ON "symptom_ingredient_mappings"("ingredient");

-- CreateIndex
CREATE UNIQUE INDEX "symptom_ingredient_mappings_symptom_ingredient_key" ON "symptom_ingredient_mappings"("symptom", "ingredient");

-- CreateIndex
CREATE UNIQUE INDEX "perfume_ingredients_fragellaId_ingredientName_key" ON "perfume_ingredients"("fragellaId", "ingredientName");

-- CreateIndex
CREATE INDEX "PriceAlert_userId_isActive_idx" ON "PriceAlert"("userId", "isActive");

-- CreateIndex
CREATE INDEX "PriceAlert_perfumeId_targetPrice_idx" ON "PriceAlert"("perfumeId", "targetPrice");

-- CreateIndex
CREATE INDEX "PriceAlert_lastChecked_idx" ON "PriceAlert"("lastChecked");

-- CreateIndex
CREATE UNIQUE INDEX "PriceAlert_userId_perfumeId_key" ON "PriceAlert"("userId", "perfumeId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_externalId_key" ON "subscriptions"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_moyasarPaymentId_key" ON "subscriptions"("moyasarPaymentId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_status_idx" ON "subscriptions"("userId", "status");

-- CreateIndex
CREATE INDEX "subscriptions_endDate_idx" ON "subscriptions"("endDate");

-- CreateIndex
CREATE INDEX "subscriptions_externalId_idx" ON "subscriptions"("externalId");

-- CreateIndex
CREATE INDEX "subscriptions_moyasarPaymentId_idx" ON "subscriptions"("moyasarPaymentId");

-- CreateIndex
CREATE INDEX "subscriptions_nextBillingDate_idx" ON "subscriptions"("nextBillingDate");

-- CreateIndex
CREATE INDEX "TestHistory_userId_createdAt_idx" ON "TestHistory"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ConversionEvent_eventType_createdAt_idx" ON "ConversionEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "ConversionEvent_userId_idx" ON "ConversionEvent"("userId");

-- CreateIndex
CREATE INDEX "checkout_sessions_status_createdAt_idx" ON "checkout_sessions"("status", "createdAt");

-- CreateIndex
CREATE INDEX "checkout_sessions_email_idx" ON "checkout_sessions"("email");

-- CreateIndex
CREATE INDEX "checkout_sessions_userId_idx" ON "checkout_sessions"("userId");
