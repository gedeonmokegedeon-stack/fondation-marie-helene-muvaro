import type { MetadataRoute } from 'next'
import { getSiteUrl, isPublicIndexing } from '@/lib/env'

// Évalué à l'exécution : PUBLIC_INDEXING peut changer sans rebuild de l'image.
export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const indexing = isPublicIndexing()
  return {
    rules: [
      {
        userAgent: '*',
        allow: indexing ? '/' : '',
        disallow: ['/admin', '/api/', '/installation'],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  }
}
