import { z } from 'zod';

const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

const optionalString = z.preprocess(emptyToUndefined, z.string().trim().optional());
const optionalYear = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().min(1000).max(2200).optional(),
);

export const artistFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  bio: optionalString,
  nationality: optionalString,
  birthYear: optionalYear,
  deathYear: optionalYear,
  email: z.preprocess(emptyToUndefined, z.string().trim().email('Email inválido.').optional()),
  phone: optionalString,
  website: z.preprocess(emptyToUndefined, z.string().trim().url('URL inválida.').optional()),
  instagram: optionalString,
});

export type ArtistFormInput = z.infer<typeof artistFormSchema>;
