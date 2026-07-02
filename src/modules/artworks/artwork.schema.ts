import { z } from 'zod';

const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value);

const optionalString = z.preprocess(emptyToUndefined, z.string().trim().optional());
const optionalInt = z.preprocess(emptyToUndefined, z.coerce.number().int().optional());
const optionalDecimal = z.preprocess(emptyToUndefined, z.coerce.number().nonnegative().optional());

const THEME_VALUES = [
  'PORTRAIT',
  'LANDSCAPE',
  'STILL_LIFE',
  'HISTORY_PAINTING',
  'GENRE_PAINTING',
  'ABSTRACTION',
] as const;

const STYLE_VALUES = ['RENAISSANCE', 'BAROQUE', 'IMPRESSIONISM', 'CONTEMPORARY_OTHER'] as const;

const TECHNIQUE_VALUES = ['OIL', 'ACRYLIC', 'WATERCOLOR', 'FRESCO'] as const;

const STATUS_VALUES = ['AVAILABLE', 'SOLD', 'RESERVED', 'HIDDEN'] as const;

export const artworkFormSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio.'),
  description: optionalString,
  artistId: z.string().trim().min(1, 'Elegí un artista.'),

  year: optionalInt,
  widthCm: optionalDecimal,
  heightCm: optionalDecimal,
  depthCm: optionalDecimal,

  theme: z.enum(THEME_VALUES, { message: 'Elegí un tema.' }),
  style: z.enum(STYLE_VALUES, { message: 'Elegí un estilo.' }),
  technique: z.enum(TECHNIQUE_VALUES, { message: 'Elegí una técnica.' }),
  support: optionalString,

  price: optionalDecimal,
  isPriceOnRequest: z.preprocess((v) => v === 'on' || v === true, z.boolean()).default(false),
  status: z.enum(STATUS_VALUES).default('AVAILABLE'),
  deliveryTime: optionalString,
  paymentMethods: z.preprocess(
    (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : v),
    z.array(z.string()).default([]),
  ),
  cost: optionalDecimal,
});

export type ArtworkFormInput = z.infer<typeof artworkFormSchema>;

export const THEME_OPTIONS = THEME_VALUES;
export const STYLE_OPTIONS = STYLE_VALUES;
export const TECHNIQUE_OPTIONS = TECHNIQUE_VALUES;
export const STATUS_OPTIONS = STATUS_VALUES;
