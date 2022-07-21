-- CreateTable
CREATE TABLE "Student" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
