'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, Save } from 'lucide-react'

type Settings = Record<string, string | null>

const FIELDS = [
  ['contactEmail', 'E-mail officiel', 'email'],
  ['contactPhone', 'Téléphone officiel', 'text'],
  ['address', 'Adresse officielle', 'text'],
  ['officialNote', 'Note institutionnelle', 'textarea'],
  ['donationMessage', 'Message de la page don', 'textarea'],
  ['seoDescription', 'Description SEO par défaut', 'textarea'],
] as const

export function SettingsForm({ initial }: { initial: Settings }) {
  const [values, setValues] = useState<Settings>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Enregistrement impossible.')
      setValues(result.settings)
      setMessage('Paramètres enregistrés.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card max-w-3xl space-y-5 p-6">
      {FIELDS.map(([name, label, type]) => (
        <div key={name}>
          <label className="admin-label" htmlFor={name}>
            {label}
          </label>
          {type === 'textarea' ? (
            <textarea
              id={name}
              rows={3}
              value={values[name] ?? ''}
              onChange={(e) => setValues({ ...values, [name]: e.target.value })}
              className="admin-input"
            />
          ) : (
            <input
              id={name}
              type={type}
              value={values[name] ?? ''}
              onChange={(e) => setValues({ ...values, [name]: e.target.value })}
              className="admin-input"
            />
          )}
        </div>
      ))}
      <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
        Les passerelles de paiement ne sont pas activables depuis cette interface. Elles nécessitent
        une intégration réelle, des secrets serveur et une autorisation explicite.
      </p>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      <button type="submit" disabled={saving} className="btn-primary min-h-11 px-5">
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Enregistrer
      </button>
    </form>
  )
}
