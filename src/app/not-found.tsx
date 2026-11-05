import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6">
      <div className="text-center">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="display mt-4 text-4xl">Page introuvable</h1>
        <p className="mt-3 text-navy/60">La page demandée n’existe pas ou n’est plus disponible.</p>
        <Link href="/" className="btn-primary mt-8">
          <ArrowLeft className="size-4" />
          Retour à l’accueil
        </Link>
      </div>
    </main>
  )
}
