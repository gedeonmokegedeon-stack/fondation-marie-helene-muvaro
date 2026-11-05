/**
 * Architecture de localisation — Module 0 (préparation).
 *
 * Le français est la langue par défaut ; l'anglais est prévu par
 * l'architecture. Le routage localisé (`/[locale]/…`) et le chargement des
 * dictionnaires seront branchés au Module 1 (voir docs/ARCHITECTURE.md).
 */
export const locales = ['fr', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
