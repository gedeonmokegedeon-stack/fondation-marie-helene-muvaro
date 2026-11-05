import { requireUser } from '@/lib/auth'
import { getPrisma } from '@/lib/db'
import { jsonError } from '@/lib/security'

export async function GET() {
  try {
    await requireUser('media:write')
    const rows = await getPrisma().mediaAsset.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, originalName: true, kind: true, isPublic: true },
    })
    return Response.json({ rows })
  } catch (error) {
    return jsonError(error)
  }
}
