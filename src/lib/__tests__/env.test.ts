import { describe, expect, it } from 'vitest'
import { parseServerEnv } from '@/lib/env'

const VALID_DATABASE_URL = 'postgresql://fmhm:motdepasse@localhost:5432/fmhm?schema=public'

describe('parseServerEnv', () => {
  it('accepte une configuration minimale valide', () => {
    const result = parseServerEnv({ DATABASE_URL: VALID_DATABASE_URL })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.DATABASE_URL).toBe(VALID_DATABASE_URL)
    }
  })

  it('accepte le préfixe postgres:// (variante courte)', () => {
    const result = parseServerEnv({ DATABASE_URL: 'postgres://u:p@localhost:5432/db' })
    expect(result.success).toBe(true)
  })

  it('applique development comme NODE_ENV par défaut', () => {
    const result = parseServerEnv({ DATABASE_URL: VALID_DATABASE_URL })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('development')
    }
  })

  it('rejette une configuration sans DATABASE_URL', () => {
    const result = parseServerEnv({})
    expect(result.success).toBe(false)
  })

  it('rejette une URL qui n’est pas PostgreSQL', () => {
    const result = parseServerEnv({ DATABASE_URL: 'mysql://u:p@localhost:3306/db' })
    expect(result.success).toBe(false)
  })

  it('rejette AUTH_SECRET trop court (moins de 32 caractères)', () => {
    const result = parseServerEnv({ DATABASE_URL: VALID_DATABASE_URL, AUTH_SECRET: 'trop-court' })
    expect(result.success).toBe(false)
  })

  it('accepte AUTH_SECRET vide (module authentification non actif)', () => {
    const result = parseServerEnv({ DATABASE_URL: VALID_DATABASE_URL, AUTH_SECRET: '' })
    expect(result.success).toBe(true)
  })

  it('accepte un AUTH_SECRET suffisamment fort (32 caractères ou plus)', () => {
    const result = parseServerEnv({
      DATABASE_URL: VALID_DATABASE_URL,
      AUTH_SECRET: 'a'.repeat(32),
    })
    expect(result.success).toBe(true)
  })

  it('ignore les variables inconnues sans les exposer', () => {
    const result = parseServerEnv({
      DATABASE_URL: VALID_DATABASE_URL,
      VARIABLE_INCONNUE: 'ne doit pas fuite',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect('VARIABLE_INCONNUE' in result.data).toBe(false)
    }
  })
})
