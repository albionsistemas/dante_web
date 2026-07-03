import { z } from 'zod';

const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

export const contactRequestSchema = z.object({
  name: z.string().trim().min(1, 'Tu nombre es obligatorio.'),
  email: z.string().trim().email('Email inválido.'),
  phone: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  message: z.string().trim().min(1, 'Contanos qué necesitás.'),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export const CONTACT_STATUS_VALUES = ['PENDING', 'CONTACTED', 'CLOSED'] as const;

export const contactStatusSchema = z.enum(CONTACT_STATUS_VALUES);
