import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import type { ArtistFormInput } from '@/modules/artists/artist.schema';

export function listArtists() {
  return prisma.artist.findMany({ orderBy: { name: 'asc' } });
}

export function getArtistById(id: string) {
  return prisma.artist.findUnique({ where: { id } });
}

export function listPublicArtists() {
  return prisma.artist.findMany({ orderBy: { name: 'asc' } });
}

export function getPublicArtistBySlug(slug: string) {
  return prisma.artist.findUnique({
    where: { slug },
    include: {
      artworks: {
        where: { status: { not: 'HIDDEN' } },
        include: { media: { where: { isCover: true }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || 'artista';
  let slug = base;
  let suffix = 1;

  while (true) {
    const existing = await prisma.artist.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export async function createArtist(data: ArtistFormInput, photoUrl?: string) {
  const slug = await generateUniqueSlug(data.name);

  return prisma.artist.create({
    data: {
      ...data,
      slug,
      photoUrl,
    },
  });
}

export async function updateArtist(id: string, data: ArtistFormInput, photoUrl?: string) {
  const current = await prisma.artist.findUniqueOrThrow({ where: { id } });
  const slug = data.name === current.name ? current.slug : await generateUniqueSlug(data.name, id);

  return prisma.artist.update({
    where: { id },
    data: {
      ...data,
      slug,
      ...(photoUrl ? { photoUrl } : {}),
    },
  });
}

export function deleteArtist(id: string) {
  return prisma.artist.delete({ where: { id } });
}
