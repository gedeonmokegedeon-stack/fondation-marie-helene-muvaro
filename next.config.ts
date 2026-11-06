import type { NextConfig } from 'next'

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 * X-Frame-Options / HSTS uniquement en production pour ne pas bloquer les
 * aperçus de développement. Une CSP stricte peut être ajoutée au reverse proxy.
 */
const isProduction = process.env.NODE_ENV === 'production'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
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
  output: 'standalone',
  serverExternalPackages: ['sharp', '@node-rs/argon2'],
  allowedDevOrigins: ['*.e2b.app'],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default nextConfig
