import type { Metadata } from 'next'
import { InstitutionalPage } from '@/components/institutional-page'

export const metadata: Metadata = { title: 'Conditions des dons' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <InstitutionalPage
      slug="conditions-dons"
      eyebrow="Soutenir la Fondation"
      title="Conditions des dons"
      summary="Cadre provisoire applicable aux intentions de don, en l’absence de passerelle de paiement activée."
      body={`## État actuel\nAucune passerelle de paiement n’est opérationnelle sur ce site. M-Pesa, Airtel Money, Orange Money et les paiements internationaux sont préparés dans l’architecture, mais non activés.\n\n## Intention de don\nLe formulaire public enregistre uniquement une intention : montant indicatif, devise, fréquence souhaitée, moyen de paiement envisagé et coordonnées de contact. Il ne déclenche aucun débit, aucun abonnement et aucun transfert d’argent.\n\n## Confirmation future\nLorsqu’une intégration réelle sera autorisée et configurée, un don ne pourra être marqué comme confirmé qu’après vérification côté serveur d’une notification ou d’un statut provenant du prestataire. Les reçus seront émis selon les règles officielles de la Fondation.\n\n## Données bancaires\nAucune donnée sensible de carte bancaire n’est collectée ou stockée par la plateforme. Les paiements futurs seront délégués à des prestataires agréés.\n\n## Rétractation et questions\nLes modalités officielles de rétractation, de remboursement et de contact seront publiées avant l’activation des paiements. En attendant, utilisez le formulaire de contact pour toute question.`}
    />
  )
}
