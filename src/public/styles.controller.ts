import { Request, Response } from 'express';
import { ART_STYLES } from '@/content/art-styles';
import { listPublicArtworks } from '@/modules/artworks/artwork.service';

export async function index(_req: Request, res: Response) {
  const artworks = await listPublicArtworks();

  const styles = ART_STYLES.map((style) => ({
    ...style,
    artworks: artworks.filter((artwork) => artwork.style === style.value).slice(0, 3),
  }));

  res.render('public/styles/index', { title: 'Estilos — ArteReal', styles });
}
