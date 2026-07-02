import { Request, Response } from 'express';
import { getPublicArtistBySlug, listPublicArtists } from '@/modules/artists/artist.service';

function paramSlug(req: Request): string {
  const { slug } = req.params;
  return Array.isArray(slug) ? slug[0] : slug;
}

export async function index(_req: Request, res: Response) {
  const artists = await listPublicArtists();
  res.render('public/artists/index', { title: 'Artistas — DANTE', artists });
}

export async function show(req: Request, res: Response) {
  const artist = await getPublicArtistBySlug(paramSlug(req));
  if (!artist) return res.status(404).render('public/404', { url: req.originalUrl });

  res.render('public/artists/show', { title: `${artist.name} — DANTE`, artist });
}
