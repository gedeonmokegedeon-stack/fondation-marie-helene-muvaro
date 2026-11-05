/**
 * Seed initial — Module 0.
 *
 * Volontairement minimal : uniquement des métadonnées techniques
 * d'installation. Aucune donnée institutionnelle (réalisations, chiffres,
 * partenaires, témoignages) n'est inventée ni insérée.
 *
 * Exécution : npm run db:seed
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL est manquant. Copiez .env.example vers .env et renseignez-le.')
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function main() {
  const entries = [
    { key: 'installation.name', value: 'Fondation Marie-Hélène Muvaro' },
    { key: 'installation.module', value: '0' },
  ]

  for (const entry of entries) {
    await prisma.systemMetadata.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: entry,
    })
  }

  console.log(`Seed appliqué : ${entries.length} métadonnées d'installation (idempotent).`)
}

main()
  .catch((error) => {
    console.error('Échec du seed :', error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
