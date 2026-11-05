import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import { getServerEnv } from '@/lib/env'

/**
 * Client Prisma singleton (paresseux).
 *
 * - Prisma 7 : connexion via l'adaptateur officiel `@prisma/adapter-pg`.
 * - Instancié uniquement au premier appel : le build ne requiert aucune
 *   connexion à la base de données.
 * - Mis en cache sur `globalThis` en développement pour éviter l'épuisement
 *   du pool de connexions lors du rechargement à chaud (HMR).
 */
function createPrismaClient(): PrismaClient {
  const env = getServerEnv()
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}
