import type { NextConfig } from 'next'

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 *
 * Remarques :
 * - La protection contre l'encadrement (X-Frame-Options) n'est activée qu'en
 *   production afin de ne pas bloquer les aperçus de développement (iframes).
 * - Une politique CSP complète (avec nonces) sera définie dans le module
 *   « Sécurité », une fois l'authentification en place. Voir docs/SECURITE.md.
 */
const isProduction = process.env.NODE_ENV === 'production'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  ...(isProduction
    ? [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      ]
    : []),
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Aperçus de développement proxifiés (sandbox Arena) — sans effet en production.
  allowedDevOrigins: ['*.e2b.app'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
