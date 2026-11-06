import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Badge, EmptyState, PageHero } from '@/components/ui'
import { getPrisma } from '@/lib/db'
import { PROJECT_PHASE_LABELS } from '@/lib/content'

export const metadata: Metadata = { title: 'Nos projets et réalisations' }
export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await getPrisma().project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { coverImage: true },
  })
  return (
    <>
      <PageHero
        eyebrow="Agir et rendre compte"
        title="Nos projets et réalisations"
        text="Seuls les projets validés et documentés par la Fondation sont publiés ici. Aucun résultat ou chiffre n’est inventé."
      />
      <section className="container-site py-16">
        {projects.length === 0 ? (
          <EmptyState
            title="Aucun projet officiel publié"
            text="Les projets et réalisations seront présentés avec leur contexte, leur état, leur lieu et leurs documents validés."
            action={{ href: '/contact', label: 'Proposer un échange' }}
          />
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projets/${project.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative aspect-[16/10] bg-ivory">
                  {project.coverImage ? (
                    <Image
                      src={`/api/media/${project.coverImage.id}`}
                      alt={project.coverImage.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center font-display text-3xl text-gold/50">
                      FM
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{PROJECT_PHASE_LABELS[project.phase]}</Badge>
                    {project.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-navy/50">
                        <MapPin className="size-3" />
                        {project.location}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 font-display text-xl group-hover:text-gold">
                    {project.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy/60">
                    {project.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    Découvrir
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
