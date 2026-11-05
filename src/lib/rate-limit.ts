import { getPrisma } from '@/lib/db'
import { ApiError } from '@/lib/security'

/** Compteur atomique partagé PostgreSQL ; aucune IP en clair n'est stockée. */
export async function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const prisma = getPrisma()
  const rows = await prisma.$queryRaw<Array<{ count: number }>>`
    INSERT INTO rate_limit_buckets ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, NOW() + (${windowMs} * INTERVAL '1 millisecond'), NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN rate_limit_buckets."resetAt" <= NOW() THEN 1 ELSE rate_limit_buckets."count" + 1 END,
      "resetAt" = CASE WHEN rate_limit_buckets."resetAt" <= NOW() THEN NOW() + (${windowMs} * INTERVAL '1 millisecond') ELSE rate_limit_buckets."resetAt" END,
      "updatedAt" = NOW()
    RETURNING "count"
  `
  if (Math.random() < 0.01) {
    await prisma.rateLimitBucket
      .deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 86400_000) } } })
      .catch(() => {})
  }
  if ((rows[0]?.count ?? 1) > limit) {
    throw new ApiError('Trop de tentatives. Veuillez réessayer plus tard.', 429)
  }
}
