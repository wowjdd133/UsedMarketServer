/*
  Warnings:

  - Made the column `url` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `url` VARCHAR(191) NOT NULL DEFAULT 'https://used-market.s3.ap-northeast-2.amazonaws.com/profile/default.png';
