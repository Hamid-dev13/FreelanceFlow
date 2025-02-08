-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_clientId_fkey`;

-- DropIndex
DROP INDEX `Project_clientId_fkey` ON `Project`;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
