/**
 * Identité institutionnelle officielle — VALIDÉE.
 *
 * Ces constantes sont la source de vérité de l'identité (couleurs, nom,
 * slogan). Elles ne doivent pas être modifiées sans autorisation explicite.
 * La charte graphique complète sera formalisée au Module 1.
 */
export const BRAND = {
  name: 'Fondation Marie-Hélène Muvaro',
  shortName: 'FMHM',
  slogan: 'Solidarité · Dignité · Espoir',
  location: 'Kinshasa, République démocratique du Congo',
  colors: {
    navy: '#142A46',
    gold: '#B18A42',
    white: '#FFFFFF',
    ivory: '#E9E6DF',
  },
} as const

export type BrandColor = keyof typeof BRAND.colors
