'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'

export function SetupForm({ requiresToken }: { requiresToken: boolean }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Installation impossible.')
      router.push('/admin')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Installation impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <p className="rounded-xl bg-gold/10 p-4 text-sm leading-6 text-navy/75">
        Ce compte unique disposera de tous les droits. Choisissez un mot de passe fort et
        conservez-le en lieu sûr. Aucun mot de passe par défaut n’est créé.
      </p>
      <div>
        <label className="admin-label" htmlFor="name">
          Nom complet
        </label>
        <input id="name" name="name" required className="admin-input" maxLength={120} />
      </div>
      <div>
        <label className="admin-label" htmlFor="email">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="admin-input"
          maxLength={254}
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="password">
          Mot de passe (12 caractères minimum, lettres et chiffres)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          className="admin-input"
          autoComplete="new-password"
        />
      </div>
      {requiresToken && (
        <div>
          <label className="admin-label" htmlFor="setupToken">
            Jeton d’installation
          </label>
          <input
            id="setupToken"
            name="setupToken"
            type="password"
            required
            className="admin-input"
          />
        </div>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        {loading ? 'Création…' : 'Créer le compte et se connecter'}
      </button>
    </form>
  )
}
