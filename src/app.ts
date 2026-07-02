import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import { env } from '@/config/env';
import { notFoundHandler } from '@/middlewares/not-found';
import { errorHandler } from '@/middlewares/error-handler';
import { authRouter } from '@/modules/auth/auth.routes';
import { adminRouter } from '@/admin/admin.routes';
import { galleryRouter } from '@/public/gallery.routes';
import { listPublicArtworks } from '@/modules/artworks/artwork.service';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(env.COOKIE_SECRET));
app.use(
  methodOverride((req) => {
    const override = req.query?._method;
    return typeof override === 'string' ? override : '';
  }),
);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', async (_req, res) => {
  const artworks = (await listPublicArtworks()).slice(0, 6);
  res.render('public/home', { title: 'DANTE — Obra Plástica', artworks });
});

app.use('/obras', galleryRouter);
app.use('/admin', authRouter);
app.use('/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);
