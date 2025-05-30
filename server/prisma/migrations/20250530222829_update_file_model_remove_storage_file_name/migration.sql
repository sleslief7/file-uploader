/*
  Warnings:

  - You are about to drop the column `fileName` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `storageFileName` on the `File` table. All the data in the column will be lost.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileName",
DROP COLUMN "storageFileName",
ADD COLUMN     "name" TEXT NOT NULL;
