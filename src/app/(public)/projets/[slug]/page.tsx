import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { Badge, PageHero } from '@/components/ui'
import { RichText } from '@/components/rich-text'
import { getPrisma } from '@/lib/db'
import { formatDate, PROJECT_PHASE_LABELS } from '@/lib/content'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getPrisma().project.findFirst({ where: { slug, status: 'PUBLISHED' } })
  return { title: project?.title ?? 'Projet', description: project?.summary }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getPrisma().project.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { coverImage: true },
  })
  if (!project) notFound()
  return (
    <>
      <PageHero eyebrow="Projet" title={project.title} text={project.summary}>
        <div className="mt-6 flex flex-wrap gap-3">
          <Badge>{PROJECT_PHASE_LABELS[project.phase]}</Badge>
          {project.location && (
            <span className="inline-flex items-center gap-1 text-sm text-navy/60">
              <MapPin className="size-4 text-gold" />
              {project.location}
            </span>
          )}
          {project.startDate && (
            <span className="text-sm text-navy/60">Début : {formatDate(project.startDate)}</span>
          )}
        </div>
      </PageHero>
      <section className="container-site py-14">
        <div className="mx-auto max-w-4xl">
          {project.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={`/api/media/${project.coverImage.id}`}
                alt={project.coverImage.alt || project.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}
          <RichText content={project.body} />
        </div>
      </section>
    </>
  )
}
