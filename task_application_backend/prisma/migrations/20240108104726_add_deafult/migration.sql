-- AlterTable
ALTER TABLE "User" ADD COLUMN     "workSpaceId" TEXT,
ALTER COLUMN "notificationId" DROP NOT NULL,
ALTER COLUMN "taskAssignmentId" DROP NOT NULL;
