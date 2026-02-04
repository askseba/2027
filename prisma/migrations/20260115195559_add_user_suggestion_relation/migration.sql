/*
  Warnings:

  - You are about to drop the column `userId` on the `suggestions` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `suggestions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_suggestions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "publicStatus" TEXT DEFAULT 'planned',
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_suggestions" ("category", "created_at", "description", "id", "publicStatus", "status", "title", "updated_at") SELECT "category", "created_at", "description", "id", "publicStatus", "status", "title", "updated_at" FROM "suggestions";
DROP TABLE "suggestions";
ALTER TABLE "new_suggestions" RENAME TO "suggestions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
