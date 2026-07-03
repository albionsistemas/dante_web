import { Request, Response } from 'express';
import { artistFormSchema } from '@/modules/artists/artist.schema';
import {
  createArtist,
  deleteArtist,
  getArtistById,
  listArtists,
  updateArtist,
} from '@/modules/artists/artist.service';

function photoUrlFromUpload(req: Request): string | undefined {
  return req.file ? `/uploads/artists/${req.file.filename}` : undefined;
}

function paramId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
}

function isForeignKeyViolation(err: unknown): boolean {
  const causeCode = (err as { cause?: { code?: string } })?.cause?.code;
  return causeCode === '23503' || causeCode === '23001';
}

export async function index(_req: Request, res: Response) {
  const artists = await listArtists();
  res.render('admin/artists/index', { title: 'Artistas — ArteReal Admin', artists, error: null });
}

export function newForm(_req: Request, res: Response) {
  res.render('admin/artists/form', {
    title: 'Nuevo artista — ArteReal Admin',
    artist: null,
    values: {},
    errors: {},
    action: '/admin/artists',
    overrideMethod: null,
  });
}

export async function create(req: Request, res: Response) {
  const parsed = artistFormSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).render('admin/artists/form', {
      title: 'Nuevo artista — ArteReal Admin',
      artist: null,
      values: req.body,
      errors: parsed.error.flatten().fieldErrors,
      action: '/admin/artists',
      overrideMethod: null,
    });
  }

  await createArtist(parsed.data, photoUrlFromUpload(req));
  res.redirect('/admin/artists');
}

export async function editForm(req: Request, res: Response) {
  const artist = await getArtistById(paramId(req));
  if (!artist) return res.status(404).render('public/404', { url: req.originalUrl });

  res.render('admin/artists/form', {
    title: `Editar ${artist.name} — ArteReal Admin`,
    artist,
    values: artist,
    errors: {},
    action: `/admin/artists/${artist.id}?_method=PUT`,
    overrideMethod: null,
  });
}

export async function update(req: Request, res: Response) {
  const artist = await getArtistById(paramId(req));
  if (!artist) return res.status(404).render('public/404', { url: req.originalUrl });

  const parsed = artistFormSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).render('admin/artists/form', {
      title: `Editar ${artist.name} — ArteReal Admin`,
      artist,
      values: req.body,
      errors: parsed.error.flatten().fieldErrors,
      action: `/admin/artists/${artist.id}?_method=PUT`,
      overrideMethod: null,
    });
  }

  await updateArtist(artist.id, parsed.data, photoUrlFromUpload(req));
  res.redirect('/admin/artists');
}

export async function destroy(req: Request, res: Response) {
  try {
    await deleteArtist(paramId(req));
    res.redirect('/admin/artists');
  } catch (err) {
    const isForeignKeyConstraint = isForeignKeyViolation(err);

    const artists = await listArtists();
    res.status(isForeignKeyConstraint ? 409 : 500).render('admin/artists/index', {
      title: 'Artistas — ArteReal Admin',
      artists,
      error: isForeignKeyConstraint
        ? 'No se puede eliminar: el artista tiene obras cargadas.'
        : 'Ocurrió un error al eliminar el artista.',
    });
  }
}
