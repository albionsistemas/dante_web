import { Router } from 'express';
import { requireAuth } from '@/middlewares/require-auth';
import { showDashboard } from '@/admin/dashboard.controller';
import * as artistsController from '@/admin/artists.controller';
import * as artworksController from '@/admin/artworks.controller';
import * as contactRequestsController from '@/admin/contact-requests.controller';
import { uploadArtistPhoto, uploadArtworkMedia } from '@/lib/upload';

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get('/', showDashboard);

adminRouter.get('/artists', artistsController.index);
adminRouter.get('/artists/new', artistsController.newForm);
adminRouter.post('/artists', uploadArtistPhoto.single('photo'), artistsController.create);
adminRouter.get('/artists/:id/edit', artistsController.editForm);
adminRouter.put('/artists/:id', uploadArtistPhoto.single('photo'), artistsController.update);
adminRouter.delete('/artists/:id', artistsController.destroy);

adminRouter.get('/artworks', artworksController.index);
adminRouter.get('/artworks/new', artworksController.newForm);
adminRouter.post('/artworks', uploadArtworkMedia.array('media'), artworksController.create);
adminRouter.get('/artworks/:id/edit', artworksController.editForm);
adminRouter.put('/artworks/:id', uploadArtworkMedia.array('media'), artworksController.update);
adminRouter.delete('/artworks/:id', artworksController.destroy);
adminRouter.post('/artworks/:id/media/:mediaId/move', artworksController.moveMedia);
adminRouter.put('/artworks/:id/media/:mediaId/cover', artworksController.makeCover);
adminRouter.delete('/artworks/:id/media/:mediaId', artworksController.destroyMedia);

adminRouter.get('/consultas', contactRequestsController.index);
adminRouter.put('/consultas/:id', contactRequestsController.updateStatus);
