import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import { isVideoMimeType } from '@/lib/upload';
import type { ArtworkFormInput } from '@/modules/artworks/artwork.schema';

const PUBLIC_DIR = path.join(__dirname, '..', '..', '..', 'public');

export function listArtworks() {
  return prisma.artwork.findMany({
    include: { artist: true, media: { where: { isCover: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });
}

export function getArtworkById(id: string) {
  return prisma.artwork.findUnique({
    where: { id },
    include: { artist: true, media: { orderBy: { order: 'asc' } } },
  });
}

export function listPublicArtworks() {
  return prisma.artwork.findMany({
    where: { status: { not: 'HIDDEN' } },
    include: { artist: true, media: { where: { isCover: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  });
}

function publicArtworkWhere(slug: string) {
  return { slug, status: { not: 'HIDDEN' } } as const;
}

export function findPublicArtworkBySlug(slug: string) {
  return prisma.artwork.findFirst({ where: publicArtworkWhere(slug) });
}

export function getPublicArtworkDetailBySlug(slug: string) {
  return prisma.artwork.findFirst({
    where: publicArtworkWhere(slug),
    include: { artist: true, media: { orderBy: { order: 'asc' } } },
  });
}

export async function getPublicArtworkBySlug(slug: string) {
  const artwork = await getPublicArtworkDetailBySlug(slug);
  if (!artwork) return null;

  await prisma.artwork.update({
    where: { id: artwork.id },
    data: { viewsCount: { increment: 1 } },
  });
  artwork.viewsCount += 1;

  return artwork;
}

export async function likeArtwork(id: string) {
  return prisma.artwork.update({ where: { id }, data: { likesCount: { increment: 1 } } });
}

export async function rateArtwork(id: string, value: number, previousValue?: number) {
  if (previousValue) {
    return prisma.artwork.update({
      where: { id },
      data: { ratingSum: { increment: value - previousValue } },
    });
  }

  return prisma.artwork.update({
    where: { id },
    data: { ratingSum: { increment: value }, ratingCount: { increment: 1 } },
  });
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || 'obra';
  let slug = base;
  let suffix = 1;

  while (true) {
    const existing = await prisma.artwork.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export async function createArtwork(data: ArtworkFormInput) {
  const slug = await generateUniqueSlug(data.title);
  return prisma.artwork.create({ data: { ...data, slug } });
}

export async function updateArtwork(id: string, data: ArtworkFormInput) {
  const current = await prisma.artwork.findUniqueOrThrow({ where: { id } });
  const slug = data.title === current.title ? current.slug : await generateUniqueSlug(data.title, id);

  return prisma.artwork.update({ where: { id }, data: { ...data, slug } });
}

export async function deleteArtwork(id: string) {
  const media = await prisma.artworkMedia.findMany({ where: { artworkId: id } });
  await prisma.artwork.delete({ where: { id } });
  await Promise.all(media.map((item) => deleteMediaFile(item.url)));
}

async function deleteMediaFile(url: string) {
  const filePath = path.join(PUBLIC_DIR, url);
  await fs.unlink(filePath).catch(() => {});
}

export async function addArtworkMedia(artworkId: string, files: Express.Multer.File[]) {
  const existingCount = await prisma.artworkMedia.count({ where: { artworkId } });
  const maxOrder = await prisma.artworkMedia.aggregate({
    where: { artworkId },
    _max: { order: true },
  });

  let nextOrder = (maxOrder._max.order ?? -1) + 1;

  const rows = files.map((file, index) => ({
    artworkId,
    type: isVideoMimeType(file.mimetype) ? ('VIDEO' as const) : ('IMAGE' as const),
    url: `/uploads/artworks/${file.filename}`,
    isCover: existingCount === 0 && index === 0,
    order: nextOrder++,
  }));

  await prisma.artworkMedia.createMany({ data: rows });
}

export async function deleteArtworkMedia(mediaId: string) {
  const media = await prisma.artworkMedia.delete({ where: { id: mediaId } });
  await deleteMediaFile(media.url);

  if (media.isCover) {
    const next = await prisma.artworkMedia.findFirst({
      where: { artworkId: media.artworkId },
      orderBy: { order: 'asc' },
    });
    if (next) {
      await prisma.artworkMedia.update({ where: { id: next.id }, data: { isCover: true } });
    }
  }
}

export async function setCoverMedia(artworkId: string, mediaId: string) {
  await prisma.$transaction([
    prisma.artworkMedia.updateMany({ where: { artworkId }, data: { isCover: false } }),
    prisma.artworkMedia.update({ where: { id: mediaId }, data: { isCover: true } }),
  ]);
}

export async function moveArtworkMedia(artworkId: string, mediaId: string, direction: 'up' | 'down') {
  const media = await prisma.artworkMedia.findMany({
    where: { artworkId },
    orderBy: { order: 'asc' },
  });

  const index = media.findIndex((item) => item.id === mediaId);
  const swapWithIndex = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapWithIndex < 0 || swapWithIndex >= media.length) return;

  const current = media[index];
  const swapWith = media[swapWithIndex];

  await prisma.$transaction([
    prisma.artworkMedia.update({ where: { id: current.id }, data: { order: swapWith.order } }),
    prisma.artworkMedia.update({ where: { id: swapWith.id }, data: { order: current.order } }),
  ]);
}
