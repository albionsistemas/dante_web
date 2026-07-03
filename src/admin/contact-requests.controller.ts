import { Request, Response } from 'express';
import { contactStatusSchema } from '@/modules/contact/contact.schema';
import { listContactRequests, updateContactRequestStatus } from '@/modules/contact/contact.service';

function paramId(req: Request): string {
  const { id } = req.params;
  return Array.isArray(id) ? id[0] : id;
}

export async function index(_req: Request, res: Response) {
  const requests = await listContactRequests();
  res.render('admin/contact-requests/index', { title: 'Consultas — ArteReal Admin', requests });
}

export async function updateStatus(req: Request, res: Response) {
  const parsed = contactStatusSchema.safeParse(req.body.status);
  if (parsed.success) {
    await updateContactRequestStatus(paramId(req), parsed.data);
  }
  res.redirect('/admin/consultas');
}
