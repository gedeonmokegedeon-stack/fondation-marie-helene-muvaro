import type { Metadata } from 'next'
import { InstitutionalPage } from '@/components/institutional-page'

export const metadata: Metadata = { title: 'Vision, mission et valeurs' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <InstitutionalPage
      slug="vision-mission-valeurs"
      eyebrow="Cap et principes"
      title="Vision, mission et valeurs"
      summary="Une proposition de cadre institutionnel, à confirmer par les instances officielles de la Fondation."
      body={`## Contenu provisoire — proposition de travail\nLes formulations ci-dessous sont des pistes de rédaction. Elles ne constituent pas encore la vision ou la mission officiellement adoptée par la Fondation.\n\n## Vision proposée\nContribuer à des communautés plus dignes, plus solidaires et porteuses d’espoir, en valorisant les initiatives locales et la participation des personnes concernées.\n\n## Mission proposée\nMobiliser des compétences, des ressources et des partenariats au service d’actions humanitaires et communautaires, dans le respect de la dignité humaine et avec une exigence de transparence.\n\n## Valeurs proposées\n- Solidarité : agir avec et pour les communautés.\n- Dignité : respecter chaque personne, sans jugement ni assistanat.\n- Espoir : soutenir des solutions constructives et durables.\n- Transparence : documenter les actions et rendre compte des ressources.\n- Responsabilité : protéger les données et respecter les engagements.\n\nCes éléments devront être validés, amendés ou remplacés par la Fondation avant publication définitive.`}
    />
  )
}
