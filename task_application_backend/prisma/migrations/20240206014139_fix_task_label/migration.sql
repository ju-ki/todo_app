/*
  Warnings:

  - The values [REQUIRED,IMPORTANT,PRIORITY,OPTIONAL] on the enum `TaskLabel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskLabel_new" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
ALTER TABLE "Task" ALTER COLUMN "label" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "label" TYPE "TaskLabel_new" USING ("label"::text::"TaskLabel_new");
ALTER TYPE "TaskLabel" RENAME TO "TaskLabel_old";
ALTER TYPE "TaskLabel_new" RENAME TO "TaskLabel";
DROP TYPE "TaskLabel_old";
ALTER TABLE "Task" ALTER COLUMN "label" SET DEFAULT 'MEDIUM';
COMMIT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "label" SET DEFAULT 'MEDIUM';
