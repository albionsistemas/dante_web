import { Request, Response } from 'express';
import { env } from '@/config/env';
import { loginSchema } from '@/modules/auth/auth.schema';
import { authenticateAdmin, createSessionToken, parseDurationToMs } from '@/modules/auth/auth.service';
import { SESSION_COOKIE_NAME } from '@/middlewares/require-auth';

export function showLoginForm(_req: Request, res: Response) {
  res.render('admin/login', { title: 'Ingresar — ArteReal Admin', error: null });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).render('admin/login', {
      title: 'Ingresar — ArteReal Admin',
      error: 'Revisá el email y la contraseña ingresados.',
    });
  }

  const { email, password } = parsed.data;
  const admin = await authenticateAdmin(email, password);

  if (!admin) {
    return res.status(401).render('admin/login', {
      title: 'Ingresar — ArteReal Admin',
      error: 'Email o contraseña incorrectos.',
    });
  }

  const token = createSessionToken(admin);

  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: parseDurationToMs(env.JWT_EXPIRES_IN, 7 * 24 * 60 * 60 * 1000),
  });

  res.redirect('/admin');
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(SESSION_COOKIE_NAME);
  res.redirect('/admin/login');
}
