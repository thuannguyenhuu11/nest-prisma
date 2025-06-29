/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/

ALTER TABLE "User" RENAME TO "users";

ALTER TABLE "users"
ADD COLUMN "phone" VARCHAR(191) NOT NULL; 
