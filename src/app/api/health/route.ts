import { NextResponse } from 'next/server'
import { getPrisma } from '@/lib/db'

/**
 * Sonde de santé applicative (publique, en lecture seule).
 *
 * - Vérifie la connexion réelle à PostgreSQL via une requête triviale.
 * - Ne divulgue aucun détail technique (hôte, identifiants, erreur interne).
 * - Répond 200 si tout est opérationnel, 503 si la base est injoignable.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const timestamp = new Date().toISOString()

  try {
    const prisma = getPrisma()
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', database: 'up', timestamp })
  } catch {
    return NextResponse.json({ status: 'degraded', database: 'down', timestamp }, { status: 503 })
  }
}
