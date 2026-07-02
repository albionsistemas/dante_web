import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';

const ARTIST_PHOTOS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'artists');
const ARTWORK_MEDIA_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'artworks');

fs.mkdirSync(ARTIST_PHOTOS_DIR, { recursive: true });
fs.mkdirSync(ARTWORK_MEDIA_DIR, { recursive: true });

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

function randomFilename(originalname: string): string {
  const ext = path.extname(originalname).toLowerCase();
  return `${crypto.randomUUID()}${ext}`;
}

const artistPhotoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, ARTIST_PHOTOS_DIR),
  filename: (_req, file, cb) => cb(null, randomFilename(file.originalname)),
});

export const uploadArtistPhoto = multer({
  storage: artistPhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('La foto debe ser JPEG, PNG o WEBP.'));
    }
    cb(null, true);
  },
});

const artworkMediaStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, ARTWORK_MEDIA_DIR),
  filename: (_req, file, cb) => cb(null, randomFilename(file.originalname)),
});

export const uploadArtworkMedia = multer({
  storage: artworkMediaStorage,
  limits: { fileSize: 100 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype) && !ALLOWED_VIDEO_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error('Cada archivo debe ser una imagen (JPEG/PNG/WEBP) o un video (MP4/WEBM/MOV).'));
    }
    cb(null, true);
  },
});

export function isVideoMimeType(mimetype: string): boolean {
  return ALLOWED_VIDEO_MIME_TYPES.has(mimetype);
}
