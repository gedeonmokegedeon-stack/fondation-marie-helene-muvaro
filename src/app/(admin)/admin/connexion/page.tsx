import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionUser, getSetupState } from '@/lib/auth'
import { LoginForm } from '@/components/admin/login-form'

export const metadata: Metadata = { title: 'Connexion administration' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const user = await getSessionUser()
  if (user) redirect('/admin')
  const setup = await getSetupState()
  return (
    <main className="grid min-h-dvh place-items-center bg-navy px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center font-display text-2xl text-white">
          Fondation Marie-Hélène Muvaro
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-soft">
          <h1 className="font-display text-2xl">Connexion</h1>
          <p className="mt-2 text-sm text-slate-500">Accès réservé aux personnes autorisées.</p>
          <LoginForm />
          {setup.available && (
            <p className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
              Première utilisation ?{' '}
              <Link href="/installation" className="font-semibold text-gold">
                Créer le compte administrateur
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
