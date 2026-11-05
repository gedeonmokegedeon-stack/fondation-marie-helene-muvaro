import { getPrisma } from '@/lib/db'
import type { Prisma } from '@/generated/prisma/client'

/** Journal sans secrets : appeler avec des métadonnées minimales et non sensibles. */
export async function recordAudit(input: {
  actorId?: string | null
  action: string
  entity: string
  entityId?: string | null
  metadata?: Prisma.InputJsonValue
}) {
  await getPrisma().auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      metadata: input.metadata,
    },
  })
}
