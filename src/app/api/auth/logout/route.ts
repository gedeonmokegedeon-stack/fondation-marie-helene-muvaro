import type { NextRequest } from 'next/server'
import { destroyCurrentSession, getSessionUser } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { assertTrustedOrigin, jsonError } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request)
    const user = await getSessionUser()
    await destroyCurrentSession()
    if (user) await recordAudit({ actorId: user.id, action: 'LOGOUT', entity: 'session' })
    return Response.json({ ok: true })
  } catch (error) {
    return jsonError(error)
  }
}
