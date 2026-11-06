import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowUpRight, Handshake } from 'lucide-react'
import { CtaBand, EmptyState, PageHero } from '@/components/ui'
import { getPrisma } from '@/lib/db'

export const metadata: Metadata = { title: 'Nos partenaires' }
export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  const partners = await getPrisma().partner.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
    include: { logo: true },
  })
  return (
    <>
      <PageHero
        eyebrow="Construire ensemble"
        title="Nos partenaires"
        text="La Fondation valorise les collaborations officiellement confirmées. Aucun partenaire n’est ajouté sans validation."
      />
      <section className="container-site py-16">
        {partners.length === 0 ? (
          <EmptyState
            title="Aucun partenaire officiel publié"
            text="Les partenaires confirmés seront présentés ici avec leur nom, leur description et, si disponible, leur site officiel."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <article key={partner.id} className="card p-7">
                <div className="grid h-20 place-items-center rounded-xl bg-ivory/60">
                  {partner.logo ? (
                    <Image
                      src={`/api/media/${partner.logo.id}`}
                      alt={partner.logo.alt || partner.name}
                      width={160}
                      height={64}
                      className="max-h-16 w-auto object-contain"
                    />
                  ) : (
                    <Handshake className="size-8 text-gold" />
                  )}
                </div>
                <h2 className="mt-5 font-display text-xl">{partner.name}</h2>
                <p className="mt-2 text-sm leading-6 text-navy/60">{partner.description}</p>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold"
                  >
                    Site officiel
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <CtaBand
        title="Explorer une collaboration"
        text="Vous souhaitez proposer un partenariat ? Présentez votre organisation et votre intention via le formulaire de contact."
        primary={{ href: '/contact', label: 'Proposer un partenariat' }}
      />
    </>
  )
}
