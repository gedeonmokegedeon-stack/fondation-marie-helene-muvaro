import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { PageHero, SectionHeading } from '@/components/ui'
import { DonationForm } from '@/components/donation-form'
import { getSiteSettings } from '@/lib/content'

export const metadata: Metadata = { title: 'Faire un don' }
export const dynamic = 'force-dynamic'

export default async function DonatePage() {
  const settings = await getSiteSettings()
  return (
    <>
      <PageHero
        eyebrow="Soutenir la Fondation"
        title="Faire un don"
        text={
          settings.donationMessage ??
          'Les paiements ne sont pas activés. Vous pouvez enregistrer une intention de don, sans transfert d’argent.'
        }
      />
      <section className="container-site grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            title="Un soutien préparé avec transparence"
            text="Les passerelles de paiement seront intégrées uniquement après validation officielle, configuration sécurisée et autorisation d’activation."
          />
          <div className="mt-8 card p-6">
            <ShieldCheck className="size-7 text-gold" />
            <h3 className="mt-4 font-display text-xl">Garanties actuelles</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-navy/65">
              <li>Aucun paiement réel n’est simulé.</li>
              <li>Aucune donnée de carte bancaire n’est demandée.</li>
              <li>Une intention enregistrée n’est pas un don confirmé.</li>
              <li>Les futurs reçus dépendront d’une confirmation vérifiée du prestataire.</li>
            </ul>
            <Link
              href="/conditions-dons"
              className="mt-5 inline-block text-sm font-semibold text-gold"
            >
              Lire les conditions des dons
            </Link>
          </div>
        </div>
        <DonationForm />
      </section>
    </>
  )
}
