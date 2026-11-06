import { describe, expect, it } from 'vitest'
import {
  canConfirmDonation,
  getPaymentAdapter,
  isPaymentEnabled,
  newDonationReference,
  PAYMENT_PROVIDERS,
  type VerifiedProviderEvent,
} from '@/lib/payments'

const verified: VerifiedProviderEvent = {
  provider: 'MPESA',
  externalId: 'evt_1',
  providerReference: 'ref_1',
  donationReference: 'FMHM-20261105-ABC',
  status: 'CONFIRMED',
  amount: '10.00',
  currency: 'USD',
  signatureVerified: true,
  payloadHash: 'hash',
}

describe('garde-fous paiement', () => {
  it('ne confirme jamais un don sans événement vérifié', () => {
    expect(canConfirmDonation(null)).toBe(false)
    expect(canConfirmDonation(undefined)).toBe(false)
    expect(canConfirmDonation({ ...verified, signatureVerified: false as unknown as true })).toBe(
      false,
    )
    expect(canConfirmDonation({ ...verified, providerReference: '' })).toBe(false)
    expect(canConfirmDonation({ ...verified, externalId: '' })).toBe(false)
    expect(canConfirmDonation(verified)).toBe(true)
  })

  it('laisse toutes les passerelles désactivées sans intégration réelle', () => {
    for (const provider of PAYMENT_PROVIDERS) {
      expect(isPaymentEnabled(provider.id)).toBe(false)
      expect(getPaymentAdapter(provider.id)).toBeNull()
    }
  })

  it('génère des références uniques au format attendu', () => {
    const a = newDonationReference()
    const b = newDonationReference()
    expect(a).toMatch(/^FMHM-\d{8}-[A-F0-9]{10}$/)
    expect(a).not.toBe(b)
  })
})
