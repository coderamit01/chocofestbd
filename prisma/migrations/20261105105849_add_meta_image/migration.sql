-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "metaImage" TEXT,
ADD COLUMN     "metaImagePublicId" TEXT;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "metaImage" TEXT,
ADD COLUMN     "metaImagePublicId" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "metaImage" TEXT,
ADD COLUMN     "metaImagePublicId" TEXT;
