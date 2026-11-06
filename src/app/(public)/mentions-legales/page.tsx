import type { Metadata } from 'next'
import { InstitutionalPage } from '@/components/institutional-page'

export const metadata: Metadata = { title: 'Mentions légales' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <InstitutionalPage
      slug="mentions-legales"
      eyebrow="Informations légales"
      title="Mentions légales"
      summary="Informations légales provisoires, à compléter avec les données officielles de la Fondation."
      body={`## Éditeur du site\nFondation Marie-Hélène Muvaro, organisation humanitaire basée à Kinshasa, République démocratique du Congo.\n\n## Informations à confirmer\n- Statut juridique et numéro d’enregistrement officiel.\n- Identité du responsable de publication.\n- Adresse officielle complète.\n- Coordonnées officielles de contact.\n- Hébergeur du site et coordonnées de l’hébergeur.\n\nAucune de ces informations n’est inventée. Elles seront ajoutées après transmission et validation par la Fondation.\n\n## Propriété intellectuelle\nLes contenus publiés par la Fondation sont protégés par le droit applicable. Les images d’illustration générées sont signalées comme telles et ne représentent pas des actions documentées de la Fondation.\n\n## Contact\nEn l’absence de coordonnées officielles publiées, le formulaire de contact du site permet de joindre l’équipe administrative.`}
    />
  )
}
