'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Loader2, Pencil, Plus, Search, X, Eye } from 'lucide-react'
import type { AdminField } from '@/lib/admin-resources'
import { cn } from '@/lib/utils'

type Row = Record<string, unknown>
export type ResourceUIConfig = {
  key: string
  label: string
  singular: string
  description: string
  fields: AdminField[]
  columns: string[]
  creatable: boolean
  editable: boolean
}

type MediaOption = {
  id: string
  originalName: string
  kind: 'IMAGE' | 'DOCUMENT'
  isPublic: boolean
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé',
  NEW: 'Nouveau',
  IN_REVIEW: 'En examen',
  ACCEPTED: 'Accepté',
  DECLINED: 'Non retenu',
  RESOLVED: 'Traité',
  INTENT: 'Intention',
  PENDING_PROVIDER: 'En attente',
  CONFIRMED: 'Confirmé',
  FAILED: 'Échec',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
  PROPOSED: 'Proposé',
  PLANNED: 'Planifié',
  ACTIVE: 'En cours',
  COMPLETED: 'Terminé',
  NEWS: 'Actualité',
  EVENT: 'Événement',
  IMAGE: 'Image',
  DOCUMENT: 'Document',
}

function displayValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
  if (key === 'sizeBytes') return `${Math.round(Number(value) / 1024)} Ko`
  if (key.toLowerCase().includes('at') && typeof value === 'string') {
    const d = new Date(value)
    if (!Number.isNaN(d.getTime()))
      return d.toLocaleDateString('fr-CD', { day: '2-digit', month: 'short', year: 'numeric' })
  }
  if (typeof value === 'string' && STATUS_LABELS[value]) return STATUS_LABELS[value]
  return String(value)
}

function toInputValue(field: AdminField, value: unknown): unknown {
  if (field.type === 'checkbox') return Boolean(value)
  if (field.type === 'datetime') {
    if (!value) return ''
    const d = new Date(String(value))
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 16)
  }
  return value ?? (field.type === 'select' ? (field.options?.[0]?.value ?? '') : '')
}

export function ResourceAdmin({
  config,
  initialRows,
  initialTotal,
}: {
  config: ResourceUIConfig
  initialRows: Row[]
  initialTotal: number
}) {
  const [rows, setRows] = useState(initialRows)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Row | null>(null)
  const [creating, setCreating] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [mediaOptions, setMediaOptions] = useState<MediaOption[]>([])
  const pageSize = 20

  const load = useCallback(
    async (targetPage = page, q = query, st = status) => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({
          page: String(targetPage),
          q,
          ...(st ? { status: st } : {}),
        })
        const response = await fetch(`/api/admin/${config.key}?${params}`)
        const result = await response.json()
        if (!response.ok) throw new Error(result.error ?? 'Chargement impossible.')
        setRows(result.rows)
        setTotal(result.total)
        setPage(result.page)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Chargement impossible.')
      } finally {
        setLoading(false)
      }
    },
    [config.key, page, query, status],
  )

  useEffect(() => {
    if (config.fields.some((f) => f.type === 'image' || f.type === 'document')) {
      fetch('/api/admin/media-options')
        .then((r) => r.json())
        .then((d) => setMediaOptions(d.rows ?? []))
        .catch(() => {})
    }
  }, [config.fields])

  function openEditor(row: Row | null) {
    const next: Record<string, unknown> = {}
    for (const field of config.fields) next[field.name] = toInputValue(field, row?.[field.name])
    setValues(next)
    setEditing(row)
    setCreating(row === null)
    setError('')
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload: Record<string, unknown> = {}
    for (const field of config.fields) {
      let value = values[field.name]
      if (field.type === 'checkbox') value = Boolean(value)
      else if (field.type === 'number') value = Number(value || 0)
      else if (field.type === 'datetime') value = value ? new Date(String(value)).toISOString() : ''
      payload[field.name] = value ?? ''
    }
    try {
      const response = await fetch(
        creating ? `/api/admin/${config.key}` : `/api/admin/${config.key}/${editing?.id}`,
        {
          method: creating ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )
      const result = await response.json()
      if (!response.ok)
        throw new Error(
          result.details?.[0]?.message ?? result.error ?? 'Enregistrement impossible.',
        )
      setEditing(null)
      setCreating(false)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Enregistrement impossible.')
    } finally {
      setSaving(false)
    }
  }

  const pages = Math.max(1, Math.ceil(total / pageSize))
  const hasStatus = config.columns.includes('status')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{config.label}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{config.description}</p>
        </div>
        {config.creatable && (
          <button onClick={() => openEditor(null)} className="btn-primary min-h-11 px-5">
            <Plus className="size-4" />
            Ajouter
          </button>
        )}
      </div>

      <div className="admin-card p-4">
        <form
          className="flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            load(1, query, status)
          }}
        >
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="admin-input pl-9"
            />
          </div>
          {hasStatus && (
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                load(1, query, e.target.value)
              }}
              className="admin-input w-44"
            >
              <option value="">Tous les statuts</option>
              {['DRAFT', 'PUBLISHED', 'ARCHIVED', 'NEW', 'IN_REVIEW', 'INTENT', 'CONFIRMED'].map(
                (s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s] ?? s}
                  </option>
                ),
              )}
            </select>
          )}
          <button
            type="submit"
            className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white"
          >
            Filtrer
          </button>
        </form>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {config.columns.map((col) => (
                  <th key={col} className="px-4 py-3 font-semibold">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    <Loader2 className="mx-auto size-5 animate-spin" />
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Aucun élément.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={String(row.id)} className="hover:bg-slate-50/70">
                    {config.columns.map((col) => (
                      <td key={col} className="max-w-64 truncate px-4 py-3 text-slate-700">
                        {col === 'status' || col === 'phase' || col === 'kind' ? (
                          <span
                            className={cn(
                              'badge',
                              row[col] === 'PUBLISHED' ||
                                row[col] === 'CONFIRMED' ||
                                row[col] === 'ACCEPTED'
                                ? 'bg-emerald-100 text-emerald-700'
                                : row[col] === 'INTENT'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-600',
                            )}
                          >
                            {displayValue(col, row[col])}
                          </span>
                        ) : (
                          displayValue(col, row[col])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      {config.editable ? (
                        <button
                          onClick={() => openEditor(row)}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-navy hover:bg-ivory"
                        >
                          <Pencil className="size-3.5" />
                          Modifier
                        </button>
                      ) : (
                        <button
                          onClick={() => openEditor(row)}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-navy hover:bg-ivory"
                        >
                          <Eye className="size-3.5" />
                          Détail
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <span>{total} élément(s)</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => load(page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Précédent
            </button>
            <span>
              Page {page} / {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => load(page + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {(editing || creating) && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {creating
                  ? `Ajouter — ${config.singular}`
                  : `${config.editable ? 'Modifier' : 'Détail'} — ${config.singular}`}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setCreating(false)
                }}
                className="grid size-9 place-items-center rounded-lg hover:bg-slate-100"
                aria-label="Fermer"
              >
                <X className="size-5" />
              </button>
            </div>

            {!creating &&
              (config.key === 'contacts' ||
                config.key === 'volunteers' ||
                config.key === 'donations') && (
                <div className="mb-6 space-y-2 rounded-xl bg-slate-50 p-4 text-sm">
                  {Object.entries(editing ?? {})
                    .filter(
                      ([k]) => !['id', 'updatedAt', 'consent', 'adminNote', 'status'].includes(k),
                    )
                    .map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[140px_1fr] gap-3">
                        <span className="font-medium text-slate-500">{k}</span>
                        <span className="whitespace-pre-wrap break-words text-slate-800">
                          {displayValue(k, v)}
                        </span>
                      </div>
                    ))}
                </div>
              )}

            {config.fields.length > 0 && config.editable ? (
              <form onSubmit={save} className="space-y-4">
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label className="admin-label" htmlFor={`field-${field.name}`}>
                      {field.label}
                      {field.required && ' *'}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={`field-${field.name}`}
                        rows={field.rows ?? 4}
                        required={field.required}
                        value={String(values[field.name] ?? '')}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        className="admin-input"
                      />
                    ) : field.type === 'select' ||
                      field.type === 'image' ||
                      field.type === 'document' ? (
                      <select
                        id={`field-${field.name}`}
                        required={field.required}
                        value={String(values[field.name] ?? '')}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        className="admin-input"
                      >
                        <option value="">
                          {field.type === 'image' || field.type === 'document'
                            ? '— Aucun —'
                            : 'Sélectionner'}
                        </option>
                        {(field.type === 'image' || field.type === 'document'
                          ? mediaOptions
                              .filter(
                                (m) => m.kind === (field.type === 'image' ? 'IMAGE' : 'DOCUMENT'),
                              )
                              .map((m) => ({
                                value: m.id,
                                label: `${m.originalName}${m.isPublic ? '' : ' (privé)'}`,
                              }))
                          : (field.options ?? [])
                        ).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(values[field.name])}
                          onChange={(e) => setValues({ ...values, [field.name]: e.target.checked })}
                          className="size-4 accent-gold"
                        />
                        {field.label}
                      </label>
                    ) : (
                      <input
                        id={`field-${field.name}`}
                        type={field.type === 'datetime' ? 'datetime-local' : field.type}
                        required={field.required && !(field.type === 'password' && !creating)}
                        value={String(values[field.name] ?? '')}
                        onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
                        className="admin-input"
                      />
                    )}
                    {field.help && <p className="mt-1 text-xs text-slate-400">{field.help}</p>}
                  </div>
                ))}
                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null)
                      setCreating(false)
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  >
                    Annuler
                  </button>
                  <button type="submit" disabled={saving} className="btn-primary min-h-10 px-5">
                    {saving && <Loader2 className="size-4 animate-spin" />}Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setEditing(null)
                    setCreating(false)
                  }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
