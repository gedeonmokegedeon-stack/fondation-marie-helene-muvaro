import Link from 'next/link'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { BRAND } from '@/lib/brand'

const columns: { title: string; links: [string, string][] }[] = [
  {
    title: 'La Fondation',
    links: [
      ['/a-propos', 'À propos'],
      ['/vision-mission-valeurs', 'Vision et valeurs'],
      ['/domaines-intervention', 'Domaines d’intervention'],
      ['/partenaires', 'Partenaires'],
    ],
  },
  {
    title: 'Agir',
    links: [
      ['/projets', 'Projets et réalisations'],
      ['/actualites', 'Actualités'],
      ['/rapports', 'Rapports et transparence'],
      ['/benevole', 'Devenir bénévole'],
    ],
  },
  {
    title: 'Informations',
    links: [
      ['/contact', 'Contact'],
      ['/don', 'Faire un don'],
      ['/mentions-legales', 'Mentions légales'],
      ['/confidentialite', 'Confidentialité'],
      ['/conditions-dons', 'Conditions des dons'],
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl">
            Fondation
            <br />
            Marie-Hélène Muvaro
          </p>
          <p className="mt-4 text-sm tracking-[0.18em] text-gold-light">{BRAND.slogan}</p>
          <p className="mt-6 flex items-start gap-2 text-sm leading-6 text-white/65">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
            Kinshasa, République démocratique du Congo
          </p>
          <p className="mt-6 max-w-sm text-xs leading-5 text-white/45">
            Site institutionnel en cours de finalisation. Les contenus non validés sont signalés
            comme provisoires.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
              {col.title}
            </p>
            <ul className="space-y-3">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-1 text-sm text-white/75 transition hover:text-white"
                  >
                    {label}
                    <ArrowUpRight className="size-3 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {BRAND.name}
          </span>
          <span>Solidarité · Dignité · Espoir</span>
        </div>
      </div>
    </footer>
  )
}
