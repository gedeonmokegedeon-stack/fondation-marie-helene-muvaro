import { describe, expect, it } from 'vitest'
import { emailSchema, passwordSchema, slugSchema, slugify } from '@/lib/security'

describe('validation de sécurité', () => {
  it('normalise les slugs sans accents ni caractères dangereux', () => {
    expect(slugify('  Solidarité & Dignité — Espoir ! ')).toBe('solidarite-dignite-espoir')
    expect(slugify('<script>alert(1)</script>')).toBe('script-alert-1-script')
    expect(slugify('')).toBe('')
  })

  it('valide les slugs publiables', () => {
    expect(slugSchema.safeParse('mon-projet-2026').success).toBe(true)
    expect(slugSchema.safeParse('Mon Projet').success).toBe(false)
    expect(slugSchema.safeParse('../etc').success).toBe(false)
    expect(slugSchema.safeParse('a').success).toBe(false)
  })

  it('exige des mots de passe robustes', () => {
    expect(passwordSchema.safeParse('MotDePasse2026!').success).toBe(true)
    expect(passwordSchema.safeParse('court1').success).toBe(false)
    expect(passwordSchema.safeParse('sanschiffreslong').success).toBe(false)
    expect(passwordSchema.safeParse('123456789012').success).toBe(false)
  })

  it('normalise les e-mails', () => {
    expect(emailSchema.parse('  ADMIN@Exemple.ORG ')).toBe('admin@exemple.org')
    expect(emailSchema.safeParse('pas-un-email').success).toBe(false)
  })
})
