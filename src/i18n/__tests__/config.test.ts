import { describe, expect, it } from 'vitest'
import { defaultLocale, isLocale, locales } from '@/i18n/config'
import fr from '@/i18n/messages/fr.json'
import en from '@/i18n/messages/en.json'

function flattenKeys(object: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(object).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      return flattenKeys(value as Record<string, unknown>, path)
    }
    return [path]
  })
}

describe('configuration i18n', () => {
  it('prévoit le français et l’anglais', () => {
    expect(locales).toEqual(['fr', 'en'])
  })

  it('définit le français comme langue par défaut', () => {
    expect(defaultLocale).toBe('fr')
  })

  it('valide les langues supportées', () => {
    expect(isLocale('fr')).toBe(true)
    expect(isLocale('en')).toBe(true)
    expect(isLocale('de')).toBe(false)
    expect(isLocale('')).toBe(false)
  })
})

describe('dictionnaires de traduction', () => {
  it('conservent exactement les mêmes clés entre fr et en', () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(fr).sort())
  })

  it('ne contiennent aucune valeur vide', () => {
    const dictionaries = { fr, en }
    for (const dictionary of Object.values(dictionaries)) {
      const values = flattenKeys(dictionary).map((key) =>
        key
          .split('.')
          .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)[part], dictionary),
      )
      for (const value of values) {
        expect(typeof value).toBe('string')
        expect((value as string).length).toBeGreaterThan(0)
      }
    }
  })
})
