import type { Metadata } from 'next'
import Link from 'next/link'
import { getSetupState } from '@/lib/auth'
import { getServerEnv } from '@/lib/env'
import { SetupForm } from '@/components/admin/setup-form'

export const metadata: Metadata = { title: 'Installation', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function SetupPage() {
  const state = await getSetupState()
  const requiresToken = getServerEnv().NODE_ENV === 'production'
  return (
    <main className="grid min-h-dvh place-items-center bg-ivory px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-soft">
        <p className="eyebrow">Première configuration</p>
        <h1 className="display mt-3 text-3xl">Créer le compte administrateur</h1>
        {state.initialized ? (
          <div className="mt-6 rounded-xl bg-amber-50 p-5 text-sm leading-6 text-amber-800">
            L’installation est déjà initialisée. Aucun compte supplémentaire ne peut être créé par
            cette page.{' '}
            <Link href="/admin/connexion" className="font-semibold underline">
              Se connecter
            </Link>
          </div>
        ) : !state.available ? (
          <div className="mt-6 rounded-xl bg-amber-50 p-5 text-sm leading-6 text-amber-800">
            L’installation publique est désactivée en production. Configurez un jeton
            `ADMIN_SETUP_TOKEN` côté serveur ou utilisez la procédure d’exploitation documentée.
          </div>
        ) : (
          <SetupForm requiresToken={requiresToken} />
        )}
      </div>
    </main>
  )
}
