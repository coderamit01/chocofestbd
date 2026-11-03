/*
  Warnings:

  - Added the required column `address` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ORDER_HANDLER', 'RIDER', 'PACKER', 'ACCOUNTANT', 'CUSTOMER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';
