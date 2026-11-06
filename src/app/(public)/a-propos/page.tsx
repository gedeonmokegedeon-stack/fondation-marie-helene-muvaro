import type { Metadata } from 'next'
import { InstitutionalPage } from '@/components/institutional-page'

export const metadata: Metadata = { title: 'À propos de la Fondation' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <InstitutionalPage
      slug="a-propos"
      eyebrow="La Fondation"
      title="À propos de la Fondation Marie-Hélène Muvaro"
      summary="Une organisation humanitaire basée à Kinshasa, en République démocratique du Congo, portée par un esprit de solidarité et de dignité."
      body={`## Présentation\nLa Fondation Marie-Hélène Muvaro est une organisation à vocation humanitaire basée à Kinshasa, en République démocratique du Congo. Son identité officielle repose sur trois mots : Solidarité, Dignité, Espoir.\n\n## Contenu provisoire\nL’historique officiel, la gouvernance, les textes fondateurs et les informations institutionnelles détaillées ne sont pas encore fournis. Ils seront publiés ici après validation, sans invention ni extrapolation.\n\n## Notre engagement de présentation\n- Ne présenter que des informations validées.\n- Identifier clairement les contenus provisoires.\n- Publier les projets, réalisations et rapports uniquement lorsqu’ils sont documentés.\n- Rendre l’information accessible sur ordinateur, tablette et téléphone.`}
    />
  )
}
