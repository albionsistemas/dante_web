import { Request, Response } from 'express';
import { contactRequestSchema } from '@/modules/contact/contact.schema';
import { createContactRequest } from '@/modules/contact/contact.service';
import { findPublicArtworkBySlug, getPublicArtworkDetailBySlug } from '@/modules/artworks/artwork.service';

function paramSlug(req: Request): string {
  const { slug } = req.params;
  return Array.isArray(slug) ? slug[0] : slug;
}

export async function create(req: Request, res: Response) {
  const slug = paramSlug(req);
  const artwork = await findPublicArtworkBySlug(slug);
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  const parsed = contactRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    const fullArtwork = await getPublicArtworkDetailBySlug(slug);
    return res.status(400).render('public/gallery/show', {
      title: `${fullArtwork!.title} — ArteReal`,
      artwork: fullArtwork,
      hasLiked: Boolean(req.cookies[`like_${artwork.id}`]),
      myRating: Number(req.cookies[`rating_${artwork.id}`]) || null,
      contactErrors: parsed.error.flatten().fieldErrors,
      contactValues: req.body,
    });
  }

  await createContactRequest(artwork.id, parsed.data);
  res.redirect(`/obras/${slug}?consulta=ok#consulta`);
}
