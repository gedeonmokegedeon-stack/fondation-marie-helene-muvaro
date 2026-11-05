import { getPrisma } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { readMediaFile } from '@/lib/storage'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const media = await getPrisma().mediaAsset.findUnique({ where: { id } })
  if (!media || media.archivedAt) return new Response('Introuvable', { status: 404 })

  let allowed = media.isPublic
  if (!allowed && media.kind === 'IMAGE') {
    const [projects, posts, partners] = await Promise.all([
      getPrisma().project.count({ where: { coverImageId: id, status: 'PUBLISHED' } }),
      getPrisma().post.count({ where: { coverImageId: id, status: 'PUBLISHED' } }),
      getPrisma().partner.count({ where: { logoId: id, status: 'PUBLISHED' } }),
    ])
    allowed = projects + posts + partners > 0
  }
  if (!allowed && media.kind === 'DOCUMENT') {
    allowed =
      (await getPrisma().report.count({ where: { documentId: id, status: 'PUBLISHED' } })) > 0
  }
  if (!allowed) {
    const user = await getSessionUser()
    allowed = Boolean(user && hasPermission(user.role, 'media:write'))
  }
  if (!allowed) return new Response('Introuvable', { status: 404 })

  try {
    const body = await readMediaFile(media.storagePath)
    return new Response(new Uint8Array(body), {
      headers: {
        'Content-Type': media.mimeType,
        'Content-Length': String(media.sizeBytes),
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; style-src 'none'; script-src 'none'",
        'Content-Disposition':
          media.kind === 'DOCUMENT'
            ? `attachment; filename="${media.originalName.replaceAll('"', '')}"`
            : 'inline',
        'Cache-Control': media.isPublic
          ? 'public, max-age=31536000, immutable'
          : 'private, no-store',
      },
    })
  } catch {
    return new Response('Introuvable', { status: 404 })
  }
}
