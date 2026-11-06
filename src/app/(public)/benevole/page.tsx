import type { Metadata } from 'next'
import { HandHeart } from 'lucide-react'
import { PageHero, SectionHeading } from '@/components/ui'
import { PublicForm } from '@/components/public-form'

export const metadata: Metadata = { title: 'Devenir bénévole' }
export const dynamic = 'force-dynamic'

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Rejoindre la dynamique"
        title="Devenir bénévole"
        text="Mettez vos compétences et votre énergie au service d’actions solidaires. Les candidatures sont examinées par l’équipe de la Fondation."
      />
      <section className="container-site grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            title="Un engagement à construire ensemble"
            text="Le bénévolat peut prendre plusieurs formes selon les besoins validés de la Fondation et les compétences disponibles."
          />
          <div className="mt-8 card p-6">
            <HandHeart className="size-7 text-gold" />
            <h3 className="mt-4 font-display text-xl">Ce que vous pouvez partager</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-navy/65">
              <li>Compétences professionnelles ou techniques</li>
              <li>Temps et disponibilité</li>
              <li>Écoute, relais communautaire et sens de l’organisation</li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-navy/50">
              Aucune mission précise n’est promise à ce stade. Les besoins officiels seront
              confirmés par la Fondation.
            </p>
          </div>
        </div>
        <PublicForm
          endpoint="/api/volunteer"
          submitLabel="Envoyer ma candidature"
          successTitle="Candidature enregistrée"
          successText="Merci pour votre engagement. L’équipe examinera votre profil et reviendra vers vous si une opportunité correspond."
          consentLabel="J’accepte que la Fondation conserve ma candidature pour l’examiner et me recontacter."
          fields={[
            { name: 'name', label: 'Nom complet', required: true },
            { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
            { name: 'phone', label: 'Téléphone (facultatif)', type: 'tel' },
            { name: 'city', label: 'Ville', required: true },
            { name: 'skills', label: 'Compétences', type: 'textarea', required: true, rows: 3 },
            {
              name: 'availability',
              label: 'Disponibilités',
              required: true,
              placeholder: 'Ex. week-ends, quelques heures par semaine',
            },
            { name: 'motivation', label: 'Motivation', type: 'textarea', required: true, rows: 5 },
          ]}
        />
      </section>
    </>
  )
}
