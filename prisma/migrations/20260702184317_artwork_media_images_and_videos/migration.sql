/*
  Warnings:

  - You are about to drop the `artwork_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ArtworkMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- DropForeignKey
ALTER TABLE "artwork_images" DROP CONSTRAINT "artwork_images_artwork_id_fkey";

-- DropTable
DROP TABLE "artwork_images";

-- CreateTable
CREATE TABLE "artwork_media" (
    "id" TEXT NOT NULL,
    "artwork_id" TEXT NOT NULL,
    "type" "ArtworkMediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "poster_url" TEXT,
    "alt_text" TEXT,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artwork_media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "artwork_media" ADD CONSTRAINT "artwork_media_artwork_id_fkey" FOREIGN KEY ("artwork_id") REFERENCES "artworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
