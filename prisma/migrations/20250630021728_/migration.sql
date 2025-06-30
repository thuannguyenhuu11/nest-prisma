-- AlterTable
ALTER TABLE "users" RENAME CONSTRAINT "User_pkey" TO "users_pkey",
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "users_email_key";
