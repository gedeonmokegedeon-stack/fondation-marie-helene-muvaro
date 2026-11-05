'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronDown, Heart, Menu, X } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import { cn } from '@/lib/utils'

const GROUPS = [
  {
    label: 'La Fondation',
    links: [
      { href: '/a-propos', label: 'À propos' },
      { href: '/vision-mission-valeurs', label: 'Vision, mission et valeurs' },
      { href: '/domaines-intervention', label: 'Domaines d’intervention' },
    ],
  },
  {
    label: 'Nos actions',
    links: [
      { href: '/projets', label: 'Projets et réalisations' },
      { href: '/actualites', label: 'Actualités et événements' },
      { href: '/partenaires', label: 'Partenaires' },
      { href: '/rapports', label: 'Rapports et transparence' },
    ],
  },
  {
    label: 'S’engager',
    links: [
      { href: '/benevole', label: 'Devenir bénévole' },
      { href: '/contact', label: 'Contact' },
    ],
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState<string | null>(null)

  function closeAll() {
    setOpen(false)
    setGroup(null)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-navy/8 bg-paper/95 backdrop-blur">
        <div className="bg-navy text-white">
          <div className="container-site flex h-9 items-center justify-between text-[11px] tracking-wide">
            <span className="text-white/80">{BRAND.slogan}</span>
            <span className="hidden text-white/60 sm:block">
              Kinshasa · République démocratique du Congo
            </span>
          </div>
        </div>
        <div className="container-site flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Accueil — Fondation Marie-Hélène Muvaro"
          >
            <span className="grid size-11 place-items-center rounded-full border border-gold/50 bg-navy font-display text-lg text-gold">
              FM
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-semibold">Marie-Hélène Muvaro</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">
                Fondation
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {GROUPS.map((g) => (
              <div
                key={g.label}
                className="relative"
                onMouseEnter={() => setGroup(g.label)}
                onMouseLeave={() => setGroup(null)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition hover:text-gold',
                    g.links.some((l) => pathname === l.href) && 'text-gold',
                  )}
                  aria-expanded={group === g.label}
                  onClick={() => setGroup(group === g.label ? null : g.label)}
                >
                  {g.label}
                  <ChevronDown className="size-3.5" />
                </button>
                {group === g.label && (
                  <div className="absolute left-0 top-full w-72 pt-2">
                    <div className="card overflow-hidden p-2">
                      {g.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={closeAll}
                          className="block rounded-xl px-4 py-3 text-sm hover:bg-ivory/60 hover:text-gold"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/don" className="btn-gold ml-3 min-h-11 px-5">
              <Heart className="size-4" />
              Faire un don
            </Link>
          </nav>

          <button
            className="grid size-11 place-items-center rounded-full border border-navy/15 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Panneau mobile volontairement hors du <header> : le backdrop-filter du
          header crée un bloc contenant qui écraserait ce position:fixed. */}
      {open && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-paper pt-[116px] lg:hidden">
          <nav className="container-site flex flex-col gap-6 py-8" aria-label="Navigation mobile">
            {GROUPS.map((g) => (
              <div key={g.label}>
                <p className="eyebrow mb-3">{g.label}</p>
                <div className="flex flex-col">
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={closeAll}
                      className="border-b border-navy/8 py-3 text-base font-medium"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/don" onClick={closeAll} className="btn-gold w-full">
              <Heart className="size-4" />
              Faire un don
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
