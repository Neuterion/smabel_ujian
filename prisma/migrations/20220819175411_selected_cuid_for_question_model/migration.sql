/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Choice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "choice" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "questionId" TEXT NOT NULL,
    CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Choice" ("choice", "createdAt", "id", "isCorrect", "questionId", "updatedAt") SELECT "choice", "createdAt", "id", "isCorrect", "questionId", "updatedAt" FROM "Choice";
DROP TABLE "Choice";
ALTER TABLE "new_Choice" RENAME TO "Choice";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "examId" TEXT NOT NULL,
    CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "examId", "id", "question", "updatedAt") SELECT "createdAt", "examId", "id", "question", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
