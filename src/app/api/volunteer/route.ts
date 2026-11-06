import type { NextRequest } from 'next/server'
import { getPrisma } from '@/lib/db'
import { enforceRateLimit } from '@/lib/rate-limit'
import { clientRateKey, jsonError, readJson } from '@/lib/security'
import { volunteerSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const input = await readJson(request, volunteerSchema)
    await enforceRateLimit(clientRateKey(request, 'volunteer'), 5, 60 * 60_000)
    if (input.website) return Response.json({ ok: true }, { status: 202 })
    const record = await getPrisma().volunteerApplication.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        city: input.city,
        skills: input.skills,
        availability: input.availability,
        motivation: input.motivation,
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
