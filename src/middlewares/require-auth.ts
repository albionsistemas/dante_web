import { NextFunction, Request, Response } from 'express';
import { verifySessionToken } from '@/modules/auth/auth.service';

const SESSION_COOKIE = 'session';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.signedCookies[SESSION_COOKIE];
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    res.clearCookie(SESSION_COOKIE);
    return res.redirect('/admin/login');
  }

  res.locals.admin = session;
  next();
}

export function redirectIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.signedCookies[SESSION_COOKIE];
  const session = token ? verifySessionToken(token) : null;

  if (session) {
    return res.redirect('/admin');
  }

  next();
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
