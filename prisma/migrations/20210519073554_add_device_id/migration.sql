/*
  Warnings:

  - A unique constraint covering the columns `[device_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `device_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User.device_id_unique` ON `User`(`device_id`);
