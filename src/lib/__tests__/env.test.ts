import { afterEach, describe, expect, it } from 'vitest'
import { getSiteUrl, isPublicIndexing, parseServerEnv } from '@/lib/env'

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

describe('métadonnées sûres pendant le build (image Docker sans .env)', () => {
  const snapshot = { ...process.env }
  afterEach(() => {
    process.env = { ...snapshot }
  })

  it('getSiteUrl fonctionne sans DATABASE_URL ni validation complète', () => {
    delete process.env.DATABASE_URL
    delete process.env.NEXT_PUBLIC_SITE_URL
    expect(getSiteUrl()).toBe('http://localhost:3000')
  })

  it('getSiteUrl normalise l’URL publique en origine', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://fondation.example.org/chemin'
    expect(getSiteUrl()).toBe('https://fondation.example.org')
  })

  it('getSiteUrl ignore une URL invalide sans lever d’exception', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'pas une url'
    expect(getSiteUrl()).toBe('http://localhost:3000')
  })

  it('l’indexation est désactivée par défaut et activable à l’exécution', () => {
    delete process.env.PUBLIC_INDEXING
    expect(isPublicIndexing()).toBe(false)
    process.env.PUBLIC_INDEXING = '0'
    expect(isPublicIndexing()).toBe(false)
    process.env.PUBLIC_INDEXING = '1'
    expect(isPublicIndexing()).toBe(true)
  })
})
