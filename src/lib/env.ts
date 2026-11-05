import { z } from 'zod'

/**
 * Validation des variables d'environnement côté serveur.
 * Échec explicite, aucune valeur secrète journalisée, validation paresseuse.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL est requis (voir .env.example)')
    .regex(/^postgres(ql)?:\/\//, 'DATABASE_URL doit être une URL PostgreSQL'),
  AUTH_SECRET: z
    .union([z.literal(''), z.string().min(32, 'AUTH_SECRET doit contenir au moins 32 caractères')])
    .optional(),
  NEXT_PUBLIC_SITE_URL: z.union([z.literal(''), z.url()]).optional(),
  ADMIN_SETUP_TOKEN: z.string().min(24).optional().or(z.literal('')),
  STORAGE_DIR: z.string().min(1).default('./storage/private'),
  TRUST_PROXY: z.enum(['0', '1']).default('0'),
  PUBLIC_INDEXING: z.enum(['0', '1']).default('0'),
  MAX_UPLOAD_MB: z.coerce.number().int().min(1).max(25).default(10),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

export function parseServerEnv(raw: unknown) {
  return serverEnvSchema.safeParse(raw)
}

let cached: ServerEnv | undefined

export function getServerEnv(): ServerEnv {
  if (cached) return cached
  const result = parseServerEnv(process.env)
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `- ${issue.path.join('.') || '(racine)'} : ${issue.message}`)
      .join('\n')
    throw new Error(`Configuration d'environnement invalide :\n${details}`)
  }
  cached = result.data
  return cached
}

/** Secret obligatoire pour les sessions ; jamais fourni par défaut en production. */
export function getAuthSecret(): string {
  const secret = getServerEnv().AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET doit être configuré avec au moins 32 caractères aléatoires.')
  }
  return secret
}

/**
 * URL publique et indexation sont lues directement dans process.env.
 *
 * Pourquoi : ces valeurs sont nécessaires aux métadonnées, évaluées aussi
 * pendant `next build`. Or l'image Docker est construite SANS `.env`
 * (exclu par .dockerignore) et sans argument de build : exiger ici la
 * validation complète (DATABASE_URL…) ferait échouer la construction.
 * Ces fonctions restent sûres sans base de données et sont réévaluées à
 * l'exécution, ce qui permet de changer l'URL ou l'indexation sans rebuild.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!raw) return 'http://localhost:3000'
  try {
    return new URL(raw).origin
  } catch {
    return 'http://localhost:3000'
  }
}

/** Indexation publique désactivée par défaut (préproduction). */
export function isPublicIndexing(): boolean {
  return process.env.PUBLIC_INDEXING === '1'
}
