// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProvisionalNotice } from '@/components/ui/provisional-notice'

describe('ProvisionalNotice', () => {
  it('affiche le libellé « Contenu provisoire » et son contenu', () => {
    render(<ProvisionalNotice>Texte de démonstration</ProvisionalNotice>)

    expect(screen.getByText('Contenu provisoire')).toBeDefined()
    expect(screen.getByText('Texte de démonstration')).toBeDefined()
  })

  it('expose un rôle ARIA « note » pour l’accessibilité', () => {
    render(<ProvisionalNotice>Contenu</ProvisionalNotice>)
    expect(screen.getByRole('note')).toBeDefined()
  })
})
