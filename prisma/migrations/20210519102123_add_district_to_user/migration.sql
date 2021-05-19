/*
  Warnings:

  - Added the required column `districtId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `districtId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD FOREIGN KEY (`districtId`) REFERENCES `District`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
