import { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).render('public/404', { url: req.originalUrl });
}
