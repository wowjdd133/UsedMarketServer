/*
  Warnings:

  - You are about to alter the column `code` on the `Verification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Verification` MODIFY `code` INTEGER NOT NULL;
