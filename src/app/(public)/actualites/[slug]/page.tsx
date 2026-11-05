import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CalendarDays, MapPin } from 'lucide-react'
import { Badge, PageHero } from '@/components/ui'
import { RichText } from '@/components/rich-text'
import { getPrisma } from '@/lib/db'
import { formatDate } from '@/lib/content'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPrisma().post.findFirst({ where: { slug, status: 'PUBLISHED' } })
  return { title: post?.title ?? 'Publication', description: post?.excerpt }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPrisma().post.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { coverImage: true },
  })
  if (!post) notFound()
  return (
    <>
      <PageHero
        eyebrow={post.kind === 'EVENT' ? 'Événement' : 'Actualité'}
        title={post.title}
        text={post.excerpt}
      >
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-navy/60">
          <Badge tone={post.kind === 'EVENT' ? 'gold' : 'navy'}>
            {post.kind === 'EVENT' ? 'Événement' : 'Actualité'}
          </Badge>
          {post.eventStartsAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-4 text-gold" />
              {formatDate(post.eventStartsAt, true)}
            </span>
          )}
          {post.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4 text-gold" />
              {post.location}
            </span>
          )}
          {!post.eventStartsAt && <span>{formatDate(post.publishedAt)}</span>}
        </div>
      </PageHero>
      <section className="container-site py-14">
        <div className="mx-auto max-w-3xl">
          {post.coverImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={`/api/media/${post.coverImage.id}`}
                alt={post.coverImage.alt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          <RichText content={post.body} />
        </div>
      </section>
    </>
  )
}
