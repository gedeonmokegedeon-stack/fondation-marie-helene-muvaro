import { ProvisionalNotice } from '@/components/ui/provisional-notice'
import { BRAND } from '@/lib/brand'

/**
 * Page d'accueil PROVISOIRE du Module 0.
 * La véritable page d'accueil (identité, navigation, contenus validés)
 * sera conçue au Module 1, après autorisation.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-10 px-6 py-16">
      <header className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
          Site institutionnel
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">{BRAND.name}</h1>
        <p className="text-sm tracking-[0.2em] text-navy/70 uppercase">{BRAND.slogan}</p>
        <p className="max-w-xl text-sm leading-relaxed text-navy/70">
          Organisation humanitaire basée à {BRAND.location}.
        </p>
      </header>

      <ProvisionalNotice>
        Plateforme en cours de développement — Module&nbsp;0&nbsp;: fondations techniques. Les
        contenus officiels (missions, projets, actualités, dons) seront publiés après validation de
        chaque module.
      </ProvisionalNotice>

      <footer className="text-xs text-navy/50">
        © {new Date().getFullYear()} {BRAND.name}
      </footer>
    </main>
  )
}
