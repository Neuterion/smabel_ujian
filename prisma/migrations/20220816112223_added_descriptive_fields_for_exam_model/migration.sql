/*
  Warnings:

  - Made the column `duration` on table `Exam` required. This step will fail if there are existing NULL values in that column.
  - Made the column `grade` on table `Exam` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subject` on table `Exam` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Exam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exam" ("createdAt", "duration", "grade", "id", "subject", "title", "updatedAt", "userId") SELECT "createdAt", "duration", "grade", "id", "subject", "title", "updatedAt", "userId" FROM "Exam";
DROP TABLE "Exam";
ALTER TABLE "new_Exam" RENAME TO "Exam";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
