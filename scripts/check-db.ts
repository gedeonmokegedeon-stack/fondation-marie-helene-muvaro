/**
 * Vérifie la connexion PostgreSQL et l'état du schéma (lecture seule).
 * Exécution : npm run db:check
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('✖ DATABASE_URL manquant. Copiez .env.example vers .env et renseignez-le.')
    process.exit(1)
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  })

  try {
    await prisma.$queryRaw`SELECT 1`
    const count = await prisma.systemMetadata.count()
    const version = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`
    console.log('✔ Connexion PostgreSQL opérationnelle.')
    console.log(`  Serveur : ${version[0]?.version.split(' ').slice(0, 2).join(' ') ?? 'inconnu'}`)
    console.log(`  Table system_metadata : ${count} entrée(s).`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('✖ Échec de la vérification :', error instanceof Error ? error.message : error)
  process.exit(1)
})
