import { describe, expect, it } from 'vitest'
import { getResource, normalizeData } from '@/lib/admin-resources'
import { ApiError } from '@/lib/security'

describe('normalizeData — règles de publication', () => {
  it('refuse un rapport publié sans PDF avec une erreur 422 explicite', () => {
    const config = getResource('reports')!
    let error: unknown
    try {
      normalizeData(config, { slug: 'rapport', title: 'Rapport', status: 'PUBLISHED' })
    } catch (e) {
      error = e
    }
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(422)
    expect((error as ApiError).message).toContain('document PDF')
  })

  it('accepte la publication d’un rapport déjà lié à un document', () => {
    const config = getResource('reports')!
    const data = normalizeData(
      config,
      { status: 'PUBLISHED' },
      { documentId: 'doc_1', publishedAt: null },
    )
    expect(data.publishedAt).toBeInstanceOf(Date)
  })

  it('conserve la date de publication existante', () => {
    const config = getResource('projects')!
    const published = new Date('2026-01-15T10:00:00Z')
    const data = normalizeData(config, { status: 'PUBLISHED' }, { publishedAt: published })
    expect(data.publishedAt).toEqual(published)
  })

  it('retire la date de publication lors du passage en brouillon', () => {
    const config = getResource('projects')!
    const data = normalizeData(config, { status: 'DRAFT' }, { publishedAt: new Date() })
    expect(data.publishedAt).toBeNull()
  })

  it('convertit les chaînes vides et les dates en valeurs nullables', () => {
    const config = getResource('projects')!
    const data = normalizeData(config, {
      status: 'DRAFT',
      location: '',
      coverImageId: '',
      startDate: '2026-02-01T00:00:00.000Z',
      endDate: '',
    })
    expect(data.location).toBeNull()
    expect(data.coverImageId).toBeNull()
    expect(data.startDate).toBeInstanceOf(Date)
    expect(data.endDate).toBeNull()
  })

  it('n’expose aucune ressource inconnue', () => {
    expect(getResource('inexistant')).toBeNull()
    expect(getResource('__proto__')).toBeNull()
  })
})
