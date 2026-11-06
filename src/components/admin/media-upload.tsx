'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { Loader2, Upload } from 'lucide-react'

export function MediaUpload() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const form = event.currentTarget
    const data = new FormData(form)
    try {
      const response = await fetch('/api/admin/upload', { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Téléversement impossible.')
      setMessage(`Fichier ajouté : ${result.media.originalName}`)
      form.reset()
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Téléversement impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-card space-y-4 p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Upload className="size-5 text-gold" />
        Téléverser un fichier
      </h2>
      <p className="text-sm text-slate-500">
        JPEG, PNG, WebP ou PDF. Les images sont converties en WebP et les métadonnées sensibles
        retirées. Stockage hors racine publique.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="admin-label" htmlFor="file">
            Fichier
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="alt">
            Texte alternatif (images)
          </label>
          <input id="alt" name="alt" className="admin-input" maxLength={300} />
        </div>
        <div>
          <label className="admin-label" htmlFor="caption">
            Légende / source
          </label>
          <input id="caption" name="caption" className="admin-input" maxLength={500} />
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" name="isPublic" value="true" className="size-4 accent-gold" />
          Accessible publiquement
        </label>
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      <button type="submit" disabled={loading} className="btn-primary min-h-11 px-5">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        Téléverser
      </button>
    </form>
  )
}
