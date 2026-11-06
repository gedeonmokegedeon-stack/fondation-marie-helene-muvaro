'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

export type PublicField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  rows?: number
}

export function PublicForm({
  endpoint,
  fields,
  submitLabel,
  successTitle,
  successText,
  consentLabel,
}: {
  endpoint: string
  fields: PublicField[]
  submitLabel: string
  successTitle: string
  successText: string
  consentLabel: string
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [reference, setReference] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent: data.consent === 'on' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Envoi impossible.')
      setReference(result.reference ?? '')
      setStatus('success')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Envoi impossible.')
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h3 className="mt-4 font-display text-2xl">{successTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-navy/65">{successText}</p>
        {reference && (
          <p className="mt-4 rounded-lg bg-ivory px-4 py-2 font-mono text-sm">
            Référence : {reference}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-gold"> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                required={field.required}
                rows={field.rows ?? 4}
                placeholder={field.placeholder}
                className="field"
                maxLength={5000}
              />
            ) : field.type === 'select' ? (
              <select id={field.name} name={field.name} required={field.required} className="field">
                <option value="">Sélectionner</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type ?? 'text'}
                required={field.required}
                placeholder={field.placeholder}
                className="field"
                maxLength={300}
              />
            )}
          </div>
        ))}
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-navy/70">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-gold" />
        <span>{consentLabel}</span>
      </label>
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full sm:w-auto"
      >
        {status === 'loading' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        {status === 'loading' ? 'Envoi en cours…' : submitLabel}
      </button>
    </form>
  )
}
