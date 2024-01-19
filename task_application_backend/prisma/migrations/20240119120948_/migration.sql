/*
  Warnings:

  - You are about to drop the column `notificationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taskAssignmentId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workSpaceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WorkSpace` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkSpace" DROP CONSTRAINT "WorkSpace_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "notificationId",
DROP COLUMN "taskAssignmentId",
DROP COLUMN "workSpaceId";

-- AlterTable
ALTER TABLE "WorkSpace" DROP COLUMN "userId";
