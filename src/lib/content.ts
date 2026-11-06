import { getPrisma } from '@/lib/db'
import { BRAND } from '@/lib/brand'

export async function getSiteSettings() {
  return getPrisma().siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      officialNote:
        'Les coordonnées officielles et informations institutionnelles complémentaires sont en cours de validation.',
      donationMessage:
        'Les paiements ne sont pas activés. Vous pouvez enregistrer une intention de don, sans transfert d’argent.',
      seoDescription: `Fondation humanitaire basée à Kinshasa, République démocratique du Congo. ${BRAND.slogan}.`,
    },
  })
}

export function formatDate(value: Date | string | null | undefined, withTime = false): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('fr-CD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(new Date(value))
}

export const PROJECT_PHASE_LABELS = {
  PROPOSED: 'Proposition à valider',
  PLANNED: 'Planifié',
  ACTIVE: 'En cours',
  COMPLETED: 'Terminé',
} as const

export const REQUEST_STATUS_LABELS = {
  NEW: 'Nouveau',
  IN_REVIEW: 'En examen',
  ACCEPTED: 'Accepté',
  DECLINED: 'Non retenu',
  RESOLVED: 'Traité',
  ARCHIVED: 'Archivé',
} as const

export const DONATION_STATUS_LABELS = {
  INTENT: 'Intention — aucun paiement',
  PENDING_PROVIDER: 'En attente prestataire',
  CONFIRMED: 'Confirmé par le prestataire',
  FAILED: 'Échec',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
} as const
