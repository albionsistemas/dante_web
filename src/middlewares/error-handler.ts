import { NextFunction, Request, Response } from 'express';
import { env } from '@/config/env';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(500).render('public/500', {
    message: env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado.',
  });
}
