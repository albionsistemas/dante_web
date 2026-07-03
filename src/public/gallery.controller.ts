import { Request, Response } from 'express';
import { getPublicArtworkBySlug, listPublicArtworks } from '@/modules/artworks/artwork.service';

function paramSlug(req: Request): string {
  const { slug } = req.params;
  return Array.isArray(slug) ? slug[0] : slug;
}

export async function index(_req: Request, res: Response) {
  const artworks = await listPublicArtworks();
  res.render('public/gallery/index', { title: 'Galería — ArteReal', artworks });
}

export async function show(req: Request, res: Response) {
  const artwork = await getPublicArtworkBySlug(paramSlug(req));
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  res.render('public/gallery/show', { title: `${artwork.title} — ArteReal`, artwork });
}
