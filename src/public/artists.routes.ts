import { Router } from 'express';
import * as artistsController from '@/public/artists.controller';

export const publicArtistsRouter = Router();

publicArtistsRouter.get('/', artistsController.index);
publicArtistsRouter.get('/:slug', artistsController.show);
