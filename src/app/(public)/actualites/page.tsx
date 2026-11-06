import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, Newspaper } from 'lucide-react'
import { Badge, EmptyState, PageHero } from '@/components/ui'
import { getPrisma } from '@/lib/db'
import { formatDate } from '@/lib/content'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Actualités et événements' }
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ type?: string }> }

export default async function NewsPage({ searchParams }: Props) {
  const { type } = await searchParams
  const kind = type === 'event' ? 'EVENT' : type === 'news' ? 'NEWS' : undefined
  const posts = await getPrisma().post.findMany({
    where: { status: 'PUBLISHED', ...(kind ? { kind } : {}) },
    orderBy: [{ eventStartsAt: 'asc' }, { publishedAt: 'desc' }],
  })
  return (
    <>
      <PageHero
        eyebrow="Informer et rassembler"
        title="Actualités et événements"
        text="Informations vérifiées et événements confirmés par la Fondation."
      />
      <section className="container-site py-16">
        <div className="mb-10 flex flex-wrap gap-2">
          {[
            ['', 'Tout voir'],
            ['news', 'Actualités'],
            ['event', 'Événements'],
          ].map(([value, label]) => (
            <Link
              key={value}
              href={value ? `/actualites?type=${value}` : '/actualites'}
              className={cn(
                'rounded-full border px-5 py-2 text-sm font-medium transition',
                (type ?? '') === value
                  ? 'border-navy bg-navy text-white'
                  : 'border-navy/15 hover:border-gold',
              )}
            >
              {label}
            </Link>
          ))}
        </div>
        {posts.length === 0 ? (
          <EmptyState
            title="Aucune publication officielle pour le moment"
            text="Les actualités et événements seront publiés après validation. Aucun événement n’est inventé."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/actualites/${post.slug}`} className="card group p-6">
                <div className="flex items-center justify-between">
                  <Badge tone={post.kind === 'EVENT' ? 'gold' : 'navy'}>
                    {post.kind === 'EVENT' ? 'Événement' : 'Actualité'}
                  </Badge>
                  {post.kind === 'EVENT' ? (
                    <CalendarDays className="size-5 text-gold" />
                  ) : (
                    <Newspaper className="size-5 text-navy/30" />
                  )}
                </div>
                <h2 className="mt-5 font-display text-xl group-hover:text-gold">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-navy/60">{post.excerpt}</p>
                <p className="mt-5 text-xs text-navy/45">
                  {post.kind === 'EVENT' && post.eventStartsAt
                    ? formatDate(post.eventStartsAt, true)
                    : formatDate(post.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
