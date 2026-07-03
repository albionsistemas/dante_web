import { Router } from 'express';
import * as galleryController from '@/public/gallery.controller';
import * as contactController from '@/public/contact.controller';

export const galleryRouter = Router();

galleryRouter.get('/', galleryController.index);
galleryRouter.get('/:slug', galleryController.show);
galleryRouter.post('/:slug/like', galleryController.like);
galleryRouter.post('/:slug/rating', galleryController.rate);
galleryRouter.post('/:slug/consulta', contactController.create);
