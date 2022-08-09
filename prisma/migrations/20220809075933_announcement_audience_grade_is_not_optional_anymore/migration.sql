-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Announcement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "clicks" INTEGER DEFAULT 0,
    "audienceGrade" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    CONSTRAINT "Announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Announcement" ("audienceGrade", "clicks", "content", "createdAt", "id", "title", "updatedAt", "userId") SELECT coalesce("audienceGrade", '') AS "audienceGrade", "clicks", "content", "createdAt", "id", "title", "updatedAt", "userId" FROM "Announcement";
DROP TABLE "Announcement";
ALTER TABLE "new_Announcement" RENAME TO "Announcement";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
