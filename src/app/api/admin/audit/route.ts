import type { NextRequest } from 'next/server'
import { requireUser } from '@/lib/auth'
import { getPrisma } from '@/lib/db'
import { jsonError } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    await requireUser('audit:read')
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1) || 1)
    const [rows, total] = await Promise.all([
      getPrisma().auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * 30,
        take: 30,
        include: { actor: { select: { name: true, email: true } } },
      }),
      getPrisma().auditLog.count(),
    ])
    return Response.json({ rows, total, page, pageSize: 30 })
  } catch (error) {
    return jsonError(error)
  }
}
