import { STYLE_OPTIONS } from '@/modules/artworks/artwork.schema';

export interface ArtStyleInfo {
  value: (typeof STYLE_OPTIONS)[number];
  label: string;
  period: string;
  summary: string;
  characteristics: string[];
  light: string;
  palette: string;
  themes: string;
  technique: string;
}

/**
 * Content is keyed to STYLE_OPTIONS (the same enum the artwork admin form uses),
 * so this page always explains exactly the styles an artwork can actually be
 * tagged with.
 */
export const ART_STYLES: ArtStyleInfo[] = [
  {
    value: 'RENAISSANCE',
    label: 'Renacimiento',
    period: 'Siglos XIV–XVI',
    summary:
      'Recuperación de los ideales clásicos grecorromanos: proporción, armonía y perspectiva matemática. El artista deja de ser un anónimo artesano y empieza a estudiar anatomía y geometría para representar el mundo con precisión.',
    characteristics: [
      'Perspectiva lineal con punto de fuga',
      'Estudio anatómico riguroso',
      'Composiciones equilibradas y simétricas',
      'Claroscuro suave y gradual (sfumato)',
    ],
    light: 'Difusa y gradual (sfumato)',
    palette: 'Tierras, dorados, azul ultramar',
    themes: 'Religión, mitología, retrato',
    technique: 'Temple al huevo y óleo, con dibujo preparatorio',
  },
  {
    value: 'BAROQUE',
    label: 'Barroco',
    period: 'Siglos XVII–XVIII',
    summary:
      'Reacción dramática al equilibrio renacentista. Composiciones dinámicas y un contraste violento entre luz y sombra (tenebrismo) buscan involucrar emocionalmente al espectador.',
    characteristics: [
      'Tenebrismo: contraste extremo de luz y sombra',
      'Composiciones diagonales y en movimiento',
      'Teatralidad y carga emocional intensa',
      'Detalle ornamental recargado',
    ],
    light: 'Tenebrismo, foco de luz dramático',
    palette: 'Contrastes intensos, oscuros profundos',
    themes: 'Religión, poder, naturaleza muerta, vida cotidiana',
    technique: 'Óleo con veladuras, pincelada visible',
  },
  {
    value: 'IMPRESSIONISM',
    label: 'Impresionismo',
    period: 'c. 1860–1890',
    summary:
      'Ruptura con el taller académico: se pinta al aire libre para capturar la luz cambiante del instante. La pincelada suelta y visible prioriza la sensación por sobre el detalle.',
    characteristics: [
      'Pintura al aire libre (plein air)',
      'Pinceladas cortas, sueltas y visibles',
      'Colores puros yuxtapuestos, casi sin negro',
      'Interés por capturar la luz y el instante',
    ],
    light: 'Natural y cambiante, estudiada en el momento',
    palette: 'Colores puros y luminosos, sombras de color',
    themes: 'Vida cotidiana, paisaje, ocio urbano',
    technique: 'Óleo de pincelada rápida, sin mezcla previa',
  },
  {
    value: 'CONTEMPORARY_OTHER',
    label: 'Contemporáneo / Otros',
    period: 'Siglo XX en adelante',
    summary:
      'Un paraguas amplio que agrupa todo lo posterior a las vanguardias: abstracción, arte conceptual, técnicas mixtas y una experimentación constante que cuestiona qué es una obra de arte.',
    characteristics: [
      'Ruptura con la representación figurativa tradicional',
      'Mezcla libre de materiales y técnicas',
      'El concepto puede pesar tanto como la ejecución',
      'Diversidad de escalas y soportes',
    ],
    light: 'Variable, según la propuesta de cada obra',
    palette: 'Sin regla fija: del monocromo a la saturación total',
    themes: 'Identidad, sociedad, abstracción, lo cotidiano reinterpretado',
    technique: 'Mixta: acrílico, collage, técnicas digitales, instalación',
  },
];
