-- CreateEnum
CREATE TYPE "MissionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "difficulty" "MissionDifficulty" NOT NULL DEFAULT 'MEDIUM';

-- CreateTable
CREATE TABLE "MissionEvaluation" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "codeQuality" INTEGER NOT NULL,
    "deadline" INTEGER NOT NULL,
    "autonomy" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "technologies" TEXT[],
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevExperience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "techExperience" JSONB NOT NULL,
    "badges" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MissionEvaluation_missionId_key" ON "MissionEvaluation"("missionId");

-- CreateIndex
CREATE UNIQUE INDEX "DevExperience_userId_key" ON "DevExperience"("userId");

-- AddForeignKey
ALTER TABLE "MissionEvaluation" ADD CONSTRAINT "MissionEvaluation_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionEvaluation" ADD CONSTRAINT "MissionEvaluation_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionEvaluation" ADD CONSTRAINT "MissionEvaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevExperience" ADD CONSTRAINT "DevExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
