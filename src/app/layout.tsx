import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@fontsource-variable/inter'
import '@fontsource-variable/playfair-display'
import { BRAND } from '@/lib/brand'
import { getSiteUrl, isPublicIndexing } from '@/lib/env'
import './globals.css'

/**
 * Métadonnées calculées à la demande : l'URL publique et l'indexation restent
 * modifiables par variable d'environnement sans reconstruire l'image Docker.
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: `${BRAND.name} — ${BRAND.slogan}`, template: `%s — ${BRAND.name}` },
    description:
      'Fondation humanitaire basée à Kinshasa, République démocratique du Congo. Solidarité, dignité et espoir.',
    applicationName: BRAND.name,
    robots: isPublicIndexing() ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { siteName: BRAND.name, locale: 'fr_CD', type: 'website' },
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
