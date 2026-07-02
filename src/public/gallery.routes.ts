import { Router } from 'express';
import * as galleryController from '@/public/gallery.controller';

export const galleryRouter = Router();

galleryRouter.get('/', galleryController.index);
galleryRouter.get('/:slug', galleryController.show);
