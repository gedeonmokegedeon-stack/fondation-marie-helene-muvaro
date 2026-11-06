import type { MetadataRoute } from 'next'
import { getPrisma } from '@/lib/db'
import { getSiteUrl } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const staticPaths = [
    '',
    '/a-propos',
    '/vision-mission-valeurs',
    '/domaines-intervention',
    '/projets',
    '/actualites',
    '/partenaires',
    '/benevole',
    '/don',
    '/rapports',
    '/contact',
    '/mentions-legales',
    '/confidentialite',
    '/conditions-dons',
  ]
  const [projects, posts] = await Promise.all([
    getPrisma().project.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    getPrisma().post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
  ])
  return [
    ...staticPaths.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${base}/projets/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${base}/actualites/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.6,
    })),
  ]
}
