import type { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getResource, normalizeData, resourceDelegate } from '@/lib/admin-resources'
import { requireUser } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { ApiError, jsonError, readJson } from '@/lib/security'

type Params = { params: Promise<{ resource: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { resource } = await params
    const config = getResource(resource)
    if (!config) throw new ApiError('Ressource inconnue.', 404)
    await requireUser(config.readPermission ?? config.permission)
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
    const pageSize = 20
    const q = (url.searchParams.get('q') ?? '').trim().slice(0, 120)
    const status = url.searchParams.get('status')
    const where: Record<string, unknown> = {}
    if (q)
      where.OR = config.searchFields.map((field) => ({
        [field]: { contains: q, mode: 'insensitive' },
      }))
    if (status && config.columns.includes('status')) where.status = status
    const delegate = resourceDelegate(config)
    const [rows, total] = await Promise.all([
      delegate.findMany({
        where,
        orderBy: config.orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        ...(config.select ? { select: config.select } : {}),
      }),
      delegate.count({ where }),
    ])
    return Response.json({ rows, total, page, pageSize })
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { resource } = await params
    const config = getResource(resource)
    if (!config || !config.creatable) throw new ApiError('Création non autorisée.', 403)
    const user = await requireUser(config.permission)
    const parsed = await readJson(request, config.schema)
    const data = normalizeData(config, parsed as Record<string, unknown>)
    if (config.key === 'users') {
      const password = String(data.password)
      delete data.password
      data.passwordHash = await hashPassword(password)
      data.email = String(data.email).toLowerCase()
    }
    if (config.key === 'pages' || config.key === 'projects' || config.key === 'posts')
      data.updatedById = user.id
    const row = await resourceDelegate(config).create({ data })
    await recordAudit({
      actorId: user.id,
      action: 'CREATE',
      entity: config.key,
      entityId: String(row.id),
      metadata: { fields: Object.keys(data) },
    })
    revalidatePath('/', 'layout')
    return Response.json({ row }, { status: 201 })
  } catch (error) {
    return jsonError(error)
  }
}
