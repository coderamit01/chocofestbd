/*
  Warnings:

  - You are about to drop the column `imagePublicId` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `logoPublicId` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `metaImagePublicId` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `imagePublicId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `metaImagePublicId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `imagePublicId` on the `product_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `imagePublicId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaImagePublicId` on the `products` table. All the data in the column will be lost.
  - Added the required column `imageKey` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "imagePublicId",
ADD COLUMN     "imageKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "logoPublicId",
DROP COLUMN "metaImagePublicId",
ADD COLUMN     "logoKey" TEXT,
ADD COLUMN     "metaImageKey" TEXT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "imagePublicId",
DROP COLUMN "metaImagePublicId",
ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "metaImageKey" TEXT;

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "publicId",
ADD COLUMN     "key" TEXT;

-- AlterTable
ALTER TABLE "product_reviews" DROP COLUMN "imagePublicId",
ADD COLUMN     "imageKey" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "imagePublicId",
DROP COLUMN "metaImagePublicId",
ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "metaImageKey" TEXT;
