import type { NextRequest } from 'next/server'
import { getPrisma } from '@/lib/db'
import { enforceRateLimit } from '@/lib/rate-limit'
import { clientRateKey, jsonError, readJson } from '@/lib/security'
import { contactSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const input = await readJson(request, contactSchema)
    await enforceRateLimit(clientRateKey(request, 'contact'), 6, 60 * 60_000)
    if (input.website) return Response.json({ ok: true }, { status: 202 })
    const record = await getPrisma().contactRequest.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        consent: true,
      },
    })
    return Response.json(
      { ok: true, reference: record.id.slice(-8).toUpperCase() },
      { status: 201 },
    )
  } catch (error) {
    return jsonError(error)
  }
}
