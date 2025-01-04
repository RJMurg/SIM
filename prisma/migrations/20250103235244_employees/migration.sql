/*
  Warnings:

  - Added the required column `removedBy` to the `RemovedProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RemovedProducts" ADD COLUMN     "removedBy" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RemovedProducts" ADD CONSTRAINT "RemovedProducts_removedBy_fkey" FOREIGN KEY ("removedBy") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
