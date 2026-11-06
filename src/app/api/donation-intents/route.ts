import type { NextRequest } from 'next/server'
import { getPrisma } from '@/lib/db'
import { newDonationReference } from '@/lib/payments'
import { enforceRateLimit } from '@/lib/rate-limit'
import { clientRateKey, jsonError, readJson } from '@/lib/security'
import { donationIntentSchema } from '@/lib/validation'

/**
 * Enregistre une intention, jamais un paiement.
 * Aucun appel prestataire, aucun débit, aucune confirmation automatique.
 */
export async function POST(request: NextRequest) {
  try {
    const input = await readJson(request, donationIntentSchema)
    await enforceRateLimit(clientRateKey(request, 'donation-intent'), 6, 60 * 60_000)
    if (input.website) return Response.json({ ok: true }, { status: 202 })
    const donation = await getPrisma().donation.create({
      data: {
        reference: newDonationReference(),
        donorName: input.donorName,
        donorEmail: input.donorEmail,
        donorPhone: input.donorPhone || null,
        amount: input.amount.toFixed(2),
        currency: input.currency,
        frequency: input.frequency,
        provider: input.provider,
        status: 'INTENT',
        message: input.message || '',
        consent: true,
      },
    })
    return Response.json(
      { ok: true, reference: donation.reference, status: 'INTENT', paymentProcessed: false },
      { status: 201 },
    )
  } catch (error) {
    return jsonError(error)
  }
}
