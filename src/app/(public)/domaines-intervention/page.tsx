import type { Metadata } from 'next'
import { InstitutionalPage } from '@/components/institutional-page'

export const metadata: Metadata = { title: 'Domaines d’intervention' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <InstitutionalPage
      slug="domaines-intervention"
      eyebrow="Champs d’action envisagés"
      title="Nos domaines d’intervention"
      summary="Les domaines ci-dessous sont des pistes de travail proposées. Ils ne décrivent pas des programmes déjà opérationnels."
      body={`## Avertissement\nAucun domaine d’intervention officiel n’a encore été communiqué. La liste suivante est une proposition de structure, destinée à être validée par la Fondation.\n\n## Éducation et formation\nPiste : accès au savoir, accompagnement scolaire, compétences et apprentissage tout au long de la vie.\n\n## Santé et bien-être\nPiste : sensibilisation, prévention et soutien à des initiatives communautaires de santé.\n\n## Dignité et inclusion\nPiste : accompagnement des personnes en situation de vulnérabilité, protection et participation.\n\n## Développement communautaire\nPiste : solutions locales, moyens de subsistance, environnement et résilience des communautés.\n\nChaque domaine devra être confirmé, précisé et documenté avant de présenter des actions, des résultats ou des chiffres.`}
    />
  )
}
