import { describe, expect, it } from 'vitest'
import { BRAND } from '@/lib/brand'

/**
 * Garde-fou : l'identité officielle est validée et ne doit pas dériver
 * sans autorisation. Toute modification de ces valeurs doit être délibérée.
 */
describe('identité institutionnelle officielle', () => {
  it('conserve le nom officiel', () => {
    expect(BRAND.name).toBe('Fondation Marie-Hélène Muvaro')
  })

  it('conserve le slogan officiel', () => {
    expect(BRAND.slogan).toBe('Solidarité · Dignité · Espoir')
  })

  it('conserve les quatre couleurs officielles exactes', () => {
    expect(BRAND.colors).toEqual({
      navy: '#142A46',
      gold: '#B18A42',
      white: '#FFFFFF',
      ivory: '#E9E6DF',
    })
  })
})
