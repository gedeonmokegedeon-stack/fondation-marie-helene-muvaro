// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

import { SiteHeader } from '@/components/site-header'

describe('SiteHeader — navigation mobile', () => {
  it('ouvre un panneau mobile plein écran utilisable', () => {
    render(<SiteHeader />)
    const burger = screen.getByRole('button', { name: 'Ouvrir le menu' })
    expect(burger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(burger)

    const nav = screen.getByRole('navigation', { name: 'Navigation mobile' })
    expect(nav).toBeDefined()
    expect(
      screen.getByRole('button', { name: 'Fermer le menu' }).getAttribute('aria-expanded'),
    ).toBe('true')
    // Tous les liens de navigation sont présents dans le panneau.
    for (const label of [
      'À propos',
      'Projets et réalisations',
      'Rapports et transparence',
      'Contact',
    ]) {
      expect(nav.textContent).toContain(label)
    }
  })

  it('ne place pas le panneau fixed dans le header (bloc contenant du backdrop-filter)', () => {
    // Régression : le backdrop-filter du <header> créait un bloc contenant qui
    // écrasait le panneau en position:fixed (hauteur ~1px, liens inclickables).
    const { container } = render(<SiteHeader />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))

    const header = container.querySelector('header')
    const nav = screen.getByRole('navigation', { name: 'Navigation mobile' })
    expect(header).not.toBeNull()
    expect(header!.contains(nav)).toBe(false)

    const panel = nav.parentElement!
    expect(panel.className).toContain('fixed')
    expect(panel.className).toContain('inset-0')
  })

  it('referme le panneau après navigation', () => {
    render(<SiteHeader />)
    fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    const nav = screen.getByRole('navigation', { name: 'Navigation mobile' })
    const link = Array.from(nav.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('À propos'),
    )
    fireEvent.click(link!)
    expect(screen.queryByRole('navigation', { name: 'Navigation mobile' })).toBeNull()
  })
})
