import type { NextRequest } from 'next/server'
import { authenticate } from '@/lib/auth'
import { recordAudit } from '@/lib/audit'
import { enforceRateLimit } from '@/lib/rate-limit'
import { clientRateKey, jsonError, readJson } from '@/lib/security'
import { loginSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const input = await readJson(request, loginSchema)
    await enforceRateLimit(clientRateKey(request, 'login-ip'), 12, 15 * 60_000)
    await enforceRateLimit(clientRateKey(request, `login:${input.email}`), 8, 15 * 60_000)
    const user = await authenticate(input.email, input.password)
    await recordAudit({ actorId: user.id, action: 'LOGIN', entity: 'session' })
    return Response.json({ user })
  } catch (error) {
    return jsonError(error)
  }
}
