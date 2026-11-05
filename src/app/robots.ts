import type { MetadataRoute } from 'next'
import { getServerEnv, getSiteUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const indexing = getServerEnv().PUBLIC_INDEXING === '1'
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
