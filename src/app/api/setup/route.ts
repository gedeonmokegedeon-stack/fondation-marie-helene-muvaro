import type { NextRequest } from 'next/server'
import { bootstrapAdmin, createSession, getSetupState } from '@/lib/auth'
import { enforceRateLimit } from '@/lib/rate-limit'
import { clientRateKey, jsonError, readJson } from '@/lib/security'
import { setupSchema } from '@/lib/validation'

export async function GET() {
  try {
    return Response.json(await getSetupState())
  } catch (error) {
    return jsonError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await enforceRateLimit(clientRateKey(request, 'setup'), 5, 60 * 60_000)
    const input = await readJson(request, setupSchema)
    const state = await getSetupState()
    if (!state.available)
      return Response.json({ error: 'Installation indisponible.' }, { status: 403 })
    const user = await bootstrapAdmin(input)
    await createSession(user.id)
    return Response.json({ user }, { status: 201 })
  } catch (error) {
    return jsonError(error)
  }
}
