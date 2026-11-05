import type { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getResource, normalizeData, resourceDelegate } from '@/lib/admin-resources'
import { destroyUserSessions, hashPassword, requireUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { getPrisma } from '@/lib/db'
import { ApiError, jsonError, readJson } from '@/lib/security'

type Params = { params: Promise<{ resource: string; id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { resource, id } = await params
    const config = getResource(resource)
    if (!config || !config.editable) throw new ApiError('Modification non autorisée.', 403)
    const user = await requireUser(config.permission)
    const delegate = resourceDelegate(config)
    const existing = await delegate.findUnique({ where: { id } })
    if (!existing) throw new ApiError('Élément introuvable.', 404)
    const parsed = await readJson(request, config.updateSchema ?? config.schema)
    const data = normalizeData(config, parsed as Record<string, unknown>, existing)

    if (config.key === 'users') {
      const targetId = String(existing.id)
      const nextRole = String(data.role)
      const nextActive = Boolean(data.active)
      if (targetId === user.id && (!nextActive || nextRole !== 'SUPER_ADMIN')) {
        throw new ApiError('Vous ne pouvez pas désactiver ou rétrograder votre propre compte.', 400)
      }
      if (
        existing.role === 'SUPER_ADMIN' &&
        existing.active &&
        (nextRole !== 'SUPER_ADMIN' || !nextActive)
      ) {
        const others = await getPrisma().user.count({
          where: { role: 'SUPER_ADMIN', active: true, id: { not: targetId } },
        })
        if (others === 0)
          throw new ApiError('Au moins un compte super-administrateur actif est requis.', 400)
      }
      const password = typeof data.password === 'string' ? data.password : ''
      delete data.password
      if (password) data.passwordHash = await hashPassword(password)
      data.email = String(data.email).toLowerCase()
      if (password || !nextActive || existing.role !== nextRole) await destroyUserSessions(targetId)
    }

    if (config.key === 'pages' || config.key === 'projects' || config.key === 'posts')
      data.updatedById = user.id
    const row = await delegate.update({ where: { id }, data })
    await recordAudit({
      actorId: user.id,
      action: 'UPDATE',
      entity: config.key,
      entityId: id,
      metadata: { fields: Object.keys(data) },
    })
    revalidatePath('/', 'layout')
    return Response.json({
      row: config.key === 'users' ? { ...row, passwordHash: undefined } : row,
    })
  } catch (error) {
    return jsonError(error)
  }
}
