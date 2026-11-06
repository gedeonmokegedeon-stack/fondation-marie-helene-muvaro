import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { PageHero, SectionHeading } from '@/components/ui'
import { PublicForm } from '@/components/public-form'
import { getSiteSettings } from '@/lib/content'

export const metadata: Metadata = { title: 'Contact' }
export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const settings = await getSiteSettings()
  return (
    <>
      <PageHero
        eyebrow="Échanger avec la Fondation"
        title="Nous contacter"
        text="Une question, une proposition de partenariat ou une demande d’information ? Écrivez-nous via le formulaire sécurisé."
      />
      <section className="container-site grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading
            title="Coordonnées"
            text="Seules les coordonnées officiellement validées sont affichées."
          />
          <div className="mt-8 space-y-5 text-sm">
            <div className="flex gap-3">
              <MapPin className="size-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">Localisation</p>
                <p className="mt-1 text-navy/60">
                  Kinshasa, République démocratique du Congo
                  {settings.address ? ` — ${settings.address}` : ''}
                </p>
              </div>
            </div>
            {settings.contactEmail && (
              <div className="flex gap-3">
                <Mail className="size-5 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold">E-mail officiel</p>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="mt-1 block text-navy/60 hover:text-gold"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              </div>
            )}
            {settings.contactPhone && (
              <div className="flex gap-3">
                <Phone className="size-5 shrink-0 text-gold" />
                <div>
                  <p className="font-semibold">Téléphone officiel</p>
                  <p className="mt-1 text-navy/60">{settings.contactPhone}</p>
                </div>
              </div>
            )}
            {!settings.contactEmail && !settings.contactPhone && (
              <p className="rounded-xl border border-dashed border-navy/20 p-5 leading-6 text-navy/55">
                Les coordonnées officielles complémentaires sont en cours de validation. Le
                formulaire ci-contre est le canal de contact disponible.
              </p>
            )}
          </div>
        </div>
        <PublicForm
          endpoint="/api/contact"
          submitLabel="Envoyer le message"
          successTitle="Message bien reçu"
          successText="Votre demande a été enregistrée. L’équipe administrative la traitera dans les meilleurs délais."
          consentLabel="J’accepte que la Fondation conserve mes données pour répondre à ma demande."
          fields={[
            { name: 'name', label: 'Nom complet', required: true },
            { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
            { name: 'subject', label: 'Sujet', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: true, rows: 6 },
          ]}
        />
      </section>
    </>
  )
}
