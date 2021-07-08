/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `email` VARCHAR(191);

-- CreateIndex
CREATE UNIQUE INDEX `User.email_unique` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Product` ADD FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
