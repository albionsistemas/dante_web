import { Request, Response } from 'express';
import { ratingSchema } from '@/modules/artworks/artwork.schema';
import {
  findPublicArtworkBySlug,
  getPublicArtworkBySlug,
  likeArtwork,
  listPublicArtworks,
  rateArtwork,
} from '@/modules/artworks/artwork.service';

const ENGAGEMENT_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

function paramSlug(req: Request): string {
  const { slug } = req.params;
  return Array.isArray(slug) ? slug[0] : slug;
}

const HERO_SLIDE_COUNT = 4;

function buildHeroImages(artworks: Awaited<ReturnType<typeof listPublicArtworks>>): string[] {
  const covers = artworks
    .map((artwork) => artwork.media[0])
    .filter((media): media is NonNullable<typeof media> => media?.type === 'IMAGE')
    .map((media) => media.url);

  if (covers.length === 0) return [];

  const heroImages: string[] = [];
  for (let i = 0; i < HERO_SLIDE_COUNT; i++) {
    heroImages.push(covers[i % covers.length]);
  }
  return heroImages;
}

export async function index(_req: Request, res: Response) {
  const artworks = await listPublicArtworks();
  res.render('public/gallery/index', {
    title: 'Galería — ArteReal',
    artworks,
    heroImages: buildHeroImages(artworks),
  });
}

export async function show(req: Request, res: Response) {
  const artwork = await getPublicArtworkBySlug(paramSlug(req));
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  res.render('public/gallery/show', {
    title: `${artwork.title} — ArteReal`,
    artwork,
    hasLiked: Boolean(req.cookies[`like_${artwork.id}`]),
    myRating: Number(req.cookies[`rating_${artwork.id}`]) || null,
    consultaOk: req.query.consulta === 'ok',
    contactErrors: {},
    contactValues: {},
  });
}

export async function like(req: Request, res: Response) {
  const slug = paramSlug(req);
  const artwork = await findPublicArtworkBySlug(slug);
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  const cookieName = `like_${artwork.id}`;
  if (!req.cookies[cookieName]) {
    await likeArtwork(artwork.id);
    res.cookie(cookieName, '1', { maxAge: ENGAGEMENT_COOKIE_MAX_AGE, httpOnly: true, sameSite: 'lax' });
  }

  res.redirect(`/obras/${slug}#interaccion`);
}

export async function rate(req: Request, res: Response) {
  const slug = paramSlug(req);
  const artwork = await findPublicArtworkBySlug(slug);
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  const parsed = ratingSchema.safeParse(req.body);
  if (parsed.success) {
    const cookieName = `rating_${artwork.id}`;
    const previous = Number(req.cookies[cookieName]) || undefined;
    await rateArtwork(artwork.id, parsed.data.value, previous);
    res.cookie(cookieName, String(parsed.data.value), {
      maxAge: ENGAGEMENT_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  res.redirect(`/obras/${slug}#interaccion`);
}
