import type { Metadata } from 'next'
import { InstitutionalPage } from '@/components/institutional-page'

export const metadata: Metadata = { title: 'Politique de confidentialité' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <InstitutionalPage
      slug="confidentialite"
      eyebrow="Protection des données"
      title="Politique de confidentialité"
      summary="Comment le site collecte, utilise et protège les données personnelles."
      body={`## Données collectées\nLe site peut collecter les données transmises volontairement via les formulaires : nom, adresse e-mail, téléphone facultatif, ville, compétences, disponibilités, message, motivation et intention de don.\n\n## Finalités\n- Répondre aux demandes de contact.\n- Examiner les candidatures de bénévolat.\n- Recontacter les personnes ayant exprimé une intention de don.\n- Assurer la sécurité et l’administration du site.\n\n## Paiements\nAucun paiement en ligne n’est actif. Le site ne collecte et ne stocke aucune donnée de carte bancaire. Une intention de don n’est pas un paiement.\n\n## Conservation et accès\nLes données sont conservées dans la base de données de la plateforme, avec un accès administratif limité par rôles. Les durées officielles de conservation et la procédure d’exercice des droits seront précisées par la Fondation.\n\n## Cookies\nLe site public n’utilise pas de cookie publicitaire. Un cookie de session sécurisé est utilisé uniquement pour l’espace d’administration.\n\n## Sécurité\nMots de passe hachés, sessions protégées, limitation de débit, validation des formulaires, journalisation administrative et stockage des fichiers hors de la racine publique.\n\n## Contact\nPour toute question relative aux données personnelles, utilisez le formulaire de contact du site. Une adresse officielle dédiée pourra être ajoutée après validation.`}
    />
  )
}
