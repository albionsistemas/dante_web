import { Router } from 'express';
import { requireAuth } from '@/middlewares/require-auth';
import { showDashboard } from '@/admin/dashboard.controller';
import * as artistsController from '@/admin/artists.controller';
import { uploadArtistPhoto } from '@/lib/upload';

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get('/', showDashboard);

adminRouter.get('/artists', artistsController.index);
adminRouter.get('/artists/new', artistsController.newForm);
adminRouter.post('/artists', uploadArtistPhoto.single('photo'), artistsController.create);
adminRouter.get('/artists/:id/edit', artistsController.editForm);
adminRouter.put('/artists/:id', uploadArtistPhoto.single('photo'), artistsController.update);
adminRouter.delete('/artists/:id', artistsController.destroy);
