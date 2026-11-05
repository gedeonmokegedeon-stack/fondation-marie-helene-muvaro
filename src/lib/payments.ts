import { randomBytes } from 'node:crypto'
import type { DonationProvider, DonationStatus, Currency } from '@/generated/prisma/enums'

/**
 * Architecture de paiement volontairement non activée.
 * Une intention de don n'est PAS un paiement. Aucun adaptateur réel n'est
 * instancié tant que les contrats, secrets et autorisations ne sont pas fournis.
 */
export type VerifiedProviderEvent = {
  provider: Exclude<DonationProvider, 'UNASSIGNED'>
  externalId: string
  providerReference: string
  donationReference: string
  status: Extract<DonationStatus, 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'REFUNDED'>
  amount: string
  currency: Currency
  signatureVerified: true
  payloadHash: string
}

export interface PaymentProviderAdapter {
  readonly provider: Exclude<DonationProvider, 'UNASSIGNED'>
  readonly enabled: boolean
  /** Doit vérifier signature, montant, devise et référence côté serveur. */
  verifyNotification(request: Request): Promise<VerifiedProviderEvent>
  /** Vérification active auprès du prestataire avant toute confirmation. */
  checkPaymentStatus(providerReference: string): Promise<VerifiedProviderEvent>
}

const ADAPTERS: Partial<Record<DonationProvider, PaymentProviderAdapter>> = {}

export function getPaymentAdapter(provider: DonationProvider): PaymentProviderAdapter | null {
  return ADAPTERS[provider] ?? null
}

export function isPaymentEnabled(provider: DonationProvider): boolean {
  return Boolean(ADAPTERS[provider]?.enabled)
}

export const PAYMENT_PROVIDERS = [
  { id: 'MPESA', label: 'M-Pesa', description: 'Paiement mobile — intégration à configurer' },
  {
    id: 'AIRTEL_MONEY',
    label: 'Airtel Money',
    description: 'Paiement mobile — intégration à configurer',
  },
  {
    id: 'ORANGE_MONEY',
    label: 'Orange Money',
    description: 'Paiement mobile — intégration à configurer',
  },
  {
    id: 'INTERNATIONAL',
    label: 'Paiement international',
    description: 'Cartes / virement — prestataire à choisir',
  },
] as const

export function newDonationReference(): string {
  return `FMHM-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${randomBytes(5).toString('hex').toUpperCase()}`
}

/** Garde-fou métier : aucune confirmation sans événement vérifié. */
export function canConfirmDonation(event: VerifiedProviderEvent | null | undefined): boolean {
  return Boolean(event?.signatureVerified && event.providerReference && event.externalId)
}
