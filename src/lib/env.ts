import { z } from 'zod'

/**
 * Validation des variables d'environnement côté serveur.
 *
 * - Échec explicite et précoce si la configuration est invalide.
 * - Aucune valeur secrète n'est journalisée.
 * - La validation est paresseuse : `next build` ne requiert pas de base de
 *   données tant qu'aucune route ne l'utilise au moment du rendu.
 *
 * Les variables des modules ultérieurs (authentification, paiements) seront
 * ajoutées ici au fur et à mesure, avec leurs règles de validation.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL est requis (voir .env.example)')
    .regex(
      /^postgres(ql)?:\/\//,
      'DATABASE_URL doit être une URL PostgreSQL (postgresql://utilisateur:motdepasse@hôte:port/base)',
    ),
  // Requis seulement à partir du module « Authentification ».
  AUTH_SECRET: z
    .union([z.literal(''), z.string().min(32, 'AUTH_SECRET doit contenir au moins 32 caractères')])
    .optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

/** Valide un jeu de variables sans effet de bord (utilisable dans les tests). */
export function parseServerEnv(raw: unknown) {
  return serverEnvSchema.safeParse(raw)
}

let cached: ServerEnv | undefined

/** Retourne l'environnement serveur validé (mis en cache après le premier appel). */
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
