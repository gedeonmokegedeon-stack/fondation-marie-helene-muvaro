import { afterEach } from 'vitest'

// Nettoyage du DOM après chaque test de composant (environnement jsdom).
// Dans l'environnement node (tests unitaires purs), aucun nettoyage requis.
afterEach(async () => {
  if (typeof document !== 'undefined') {
    const { cleanup } = await import('@testing-library/react')
    cleanup()
  }
})
