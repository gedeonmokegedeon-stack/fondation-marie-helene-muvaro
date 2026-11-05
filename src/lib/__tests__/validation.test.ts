import { describe, expect, it } from 'vitest'
import { contactSchema, donationIntentSchema, volunteerSchema } from '@/lib/validation'

describe('formulaires publics', () => {
  const contact = {
    name: 'Amina',
    email: 'amina@example.org',
    subject: 'Partenariat',
    message: 'Bonjour, nous souhaitons échanger.',
    consent: true,
  }
  const volunteer = {
    name: 'Jean',
    email: 'jean@example.org',
    city: 'Kinshasa',
    skills: 'Logistique',
    availability: 'Week-ends',
    motivation: 'Aider la communauté.',
    consent: true,
  }
  const donation = {
    donorName: 'Sarah',
    donorEmail: 'sarah@example.org',
    amount: 25,
    currency: 'USD',
    frequency: 'ONE_TIME',
    provider: 'UNASSIGNED',
    consent: true,
  }

  it('accepte les demandes consenties et rejette le pot de miel rempli', () => {
    expect(contactSchema.safeParse(contact).success).toBe(true)
    expect(contactSchema.safeParse({ ...contact, website: 'spam' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...contact, consent: false }).success).toBe(false)
  })

  it('valide les candidatures bénévole', () => {
    expect(volunteerSchema.safeParse(volunteer).success).toBe(true)
    expect(volunteerSchema.safeParse({ ...volunteer, motivation: '' }).success).toBe(false)
  })

  it('valide une intention de don sans la traiter comme un paiement', () => {
    const parsed = donationIntentSchema.parse(donation)
    expect(parsed.amount).toBe(25)
    expect(parsed.provider).toBe('UNASSIGNED')
    expect(donationIntentSchema.safeParse({ ...donation, amount: -5 }).success).toBe(false)
    expect(donationIntentSchema.safeParse({ ...donation, amount: 10.005 }).success).toBe(false)
    expect(donationIntentSchema.safeParse({ ...donation, provider: 'CARTE' }).success).toBe(false)
  })
})
