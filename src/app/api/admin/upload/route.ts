import type { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { enforceRateLimit } from '@/lib/rate-limit'
import { assertTrustedOrigin, ApiError, clientRateKey, jsonError } from '@/lib/security'
import { saveUpload } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    const user = await requireUser('media:write')
    await enforceRateLimit(clientRateKey(request, 'upload'), 40, 60 * 60_000)
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) throw new ApiError('Fichier manquant.', 400)
    const alt = String(form.get('alt') ?? '').slice(0, 300)
    const caption = String(form.get('caption') ?? '').slice(0, 500)
    const isPublic = form.get('isPublic') === 'true'
    const media = await saveUpload(file, user, alt, caption)
    if (isPublic) {
      const { getPrisma } = await import('@/lib/db')
      await getPrisma().mediaAsset.update({ where: { id: media.id }, data: { isPublic: true } })
    }
    await recordAudit({
      actorId: user.id,
      action: 'UPLOAD',
      entity: 'media',
      entityId: media.id,
      metadata: { kind: media.kind, sizeBytes: media.sizeBytes },
    })
    revalidatePath('/', 'layout')
    return Response.json({ media }, { status: 201 })
  } catch (error) {
    return jsonError(error)
  }
}
