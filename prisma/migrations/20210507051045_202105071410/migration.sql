-- AlterTable
ALTER TABLE `User` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `District` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sig_cd` VARCHAR(191) NOT NULL,
    `sig_kor_name` VARCHAR(191) NOT NULL,
    `sig_eng_name` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
