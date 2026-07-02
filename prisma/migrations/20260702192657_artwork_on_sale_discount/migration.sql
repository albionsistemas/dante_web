-- AlterEnum
ALTER TYPE "ArtworkStatus" ADD VALUE 'ON_SALE';

-- AlterTable
ALTER TABLE "artworks" ADD COLUMN     "discount_percent" DECIMAL(65,30);
