import 'dotenv/config'
import { defineConfig } from 'prisma/config'

/**
 * Configuration Prisma 7 (CLI).
 *
 * - `dotenv/config` charge `.env` : Prisma 7 ne le fait plus automatiquement.
 * - `datasource.url` est résolu paresseusement : `prisma generate` fonctionne
 *   sans base de données ; les commandes de migration exigent DATABASE_URL.
 * - Le seed est exécuté via `tsx` (TypeScript direct, sans compilation).
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
})
