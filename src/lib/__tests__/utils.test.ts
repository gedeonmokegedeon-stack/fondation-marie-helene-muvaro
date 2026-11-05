import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('fusionne des classes simples', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('résout les conflits Tailwind (dernière valeur gagnante)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('ignore les valeurs falsy et conditionnelles', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })
})
