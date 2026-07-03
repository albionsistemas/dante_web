import { Request, Response } from 'express';

export function showDashboard(_req: Request, res: Response) {
  res.render('admin/dashboard', { title: 'Panel — ArteReal Admin', admin: res.locals.admin });
}
