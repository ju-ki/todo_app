/*
  Warnings:

  - You are about to drop the column `userAssignmentId` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "userAssignmentId",
ALTER COLUMN "notificationId" DROP NOT NULL;
