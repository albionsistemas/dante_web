import path from 'node:path';
import sharp from 'sharp';

const THUMBNAIL_MAX_WIDTH = 1200;
const THUMBNAIL_QUALITY = 82;

/**
 * Generates a lighter WebP derivative of an uploaded image, capped at
 * THUMBNAIL_MAX_WIDTH (never upscaled). Used for grids/cards/hero, where the
 * full-resolution original would be wasted bandwidth; the original file is
 * left untouched for detail-view/zoom.
 */
export async function createThumbnail(sourcePath: string, destDir: string): Promise<string> {
  const filename = `${path.parse(sourcePath).name}.webp`;
  const destPath = path.join(destDir, filename);

  await sharp(sourcePath)
    .rotate()
    .resize({ width: THUMBNAIL_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toFile(destPath);

  return filename;
}
