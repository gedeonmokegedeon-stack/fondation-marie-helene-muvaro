import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { BRAND } from '@/lib/brand'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s — ${BRAND.name}`,
  },
  description:
    'Plateforme institutionnelle de la Fondation Marie-Hélène Muvaro, organisation humanitaire basée à Kinshasa, République démocratique du Congo.',
  // Site en construction : indexation désactivée tant que le lancement
  // officiel n'est pas validé (à retirer au module « Déploiement »).
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
