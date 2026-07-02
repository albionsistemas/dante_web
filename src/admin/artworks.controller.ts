import { Request, Response } from 'express';
import { listArtists } from '@/modules/artists/artist.service';
import {
  STATUS_OPTIONS,
  STYLE_OPTIONS,
  TECHNIQUE_OPTIONS,
  THEME_OPTIONS,
  artworkFormSchema,
} from '@/modules/artworks/artwork.schema';
import {
  addArtworkMedia,
  createArtwork,
  deleteArtwork,
  deleteArtworkMedia,
  getArtworkById,
  listArtworks,
  moveArtworkMedia,
  setCoverMedia,
  updateArtwork,
} from '@/modules/artworks/artwork.service';

const ENUM_OPTIONS = {
  themeOptions: THEME_OPTIONS,
  styleOptions: STYLE_OPTIONS,
  techniqueOptions: TECHNIQUE_OPTIONS,
  statusOptions: STATUS_OPTIONS,
};

function paramId(req: Request, key = 'id'): string {
  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
}

function uploadedFiles(req: Request): Express.Multer.File[] {
  return Array.isArray(req.files) ? req.files : [];
}

export async function index(_req: Request, res: Response) {
  const artworks = await listArtworks();
  res.render('admin/artworks/index', { title: 'Obras — DANTE Admin', artworks, error: null });
}

export async function newForm(_req: Request, res: Response) {
  const artists = await listArtists();
  res.render('admin/artworks/form', {
    title: 'Nueva obra — DANTE Admin',
    artwork: null,
    artists,
    values: {},
    errors: {},
    action: '/admin/artworks',
    ...ENUM_OPTIONS,
  });
}

export async function create(req: Request, res: Response) {
  const parsed = artworkFormSchema.safeParse(req.body);

  if (!parsed.success) {
    const artists = await listArtists();
    return res.status(400).render('admin/artworks/form', {
      title: 'Nueva obra — DANTE Admin',
      artwork: null,
      artists,
      values: req.body,
      errors: parsed.error.flatten().fieldErrors,
      action: '/admin/artworks',
      ...ENUM_OPTIONS,
    });
  }

  const artwork = await createArtwork(parsed.data);

  const files = uploadedFiles(req);
  if (files.length > 0) {
    await addArtworkMedia(artwork.id, files);
  }

  res.redirect(`/admin/artworks/${artwork.id}/edit`);
}

export async function editForm(req: Request, res: Response) {
  const artwork = await getArtworkById(paramId(req));
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  const artists = await listArtists();
  res.render('admin/artworks/form', {
    title: `Editar ${artwork.title} — DANTE Admin`,
    artwork,
    artists,
    values: artwork,
    errors: {},
    action: `/admin/artworks/${artwork.id}?_method=PUT`,
    ...ENUM_OPTIONS,
  });
}

export async function update(req: Request, res: Response) {
  const artwork = await getArtworkById(paramId(req));
  if (!artwork) return res.status(404).render('public/404', { url: req.originalUrl });

  const parsed = artworkFormSchema.safeParse(req.body);

  if (!parsed.success) {
    const artists = await listArtists();
    return res.status(400).render('admin/artworks/form', {
      title: `Editar ${artwork.title} — DANTE Admin`,
      artwork,
      artists,
      values: req.body,
      errors: parsed.error.flatten().fieldErrors,
      action: `/admin/artworks/${artwork.id}?_method=PUT`,
      ...ENUM_OPTIONS,
    });
  }

  await updateArtwork(artwork.id, parsed.data);

  const files = uploadedFiles(req);
  if (files.length > 0) {
    await addArtworkMedia(artwork.id, files);
  }

  res.redirect(`/admin/artworks/${artwork.id}/edit`);
}

export async function destroy(req: Request, res: Response) {
  await deleteArtwork(paramId(req));
  res.redirect('/admin/artworks');
}

export async function destroyMedia(req: Request, res: Response) {
  await deleteArtworkMedia(paramId(req, 'mediaId'));
  res.redirect(`/admin/artworks/${paramId(req)}/edit`);
}

export async function makeCover(req: Request, res: Response) {
  await setCoverMedia(paramId(req), paramId(req, 'mediaId'));
  res.redirect(`/admin/artworks/${paramId(req)}/edit`);
}

export async function moveMedia(req: Request, res: Response) {
  const direction = req.body.direction === 'up' ? 'up' : 'down';
  await moveArtworkMedia(paramId(req), paramId(req, 'mediaId'), direction);
  res.redirect(`/admin/artworks/${paramId(req)}/edit`);
}
