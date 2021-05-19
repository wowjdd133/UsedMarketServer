/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `login_type` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Verification` DROP FOREIGN KEY `verification_ibfk_1`;

-- DropIndex
DROP INDEX `User.email_login_type_unique` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    DROP COLUMN `password`,
    DROP COLUMN `login_type`,
    MODIFY `name` VARCHAR(191);

-- DropTable
DROP TABLE `Verification`;
