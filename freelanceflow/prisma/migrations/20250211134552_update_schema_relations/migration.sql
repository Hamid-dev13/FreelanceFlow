-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_assignedToId_fkey";

-- AlterTable
ALTER TABLE "Mission" ALTER COLUMN "assignedToId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
