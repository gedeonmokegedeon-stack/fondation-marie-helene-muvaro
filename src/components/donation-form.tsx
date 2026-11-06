'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, Heart, Loader2, ShieldCheck } from 'lucide-react'
import { PAYMENT_PROVIDERS } from '@/lib/payments'
import { cn } from '@/lib/utils'

const AMOUNTS = [10, 25, 50, 100]

export function DonationForm() {
  const [amount, setAmount] = useState('25')
  const [currency, setCurrency] = useState('USD')
  const [frequency, setFrequency] = useState('ONE_TIME')
  const [provider, setProvider] = useState('UNASSIGNED')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [reference, setReference] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch('/api/donation-intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          amount,
          currency,
          frequency,
          provider,
          consent: data.consent === 'on',
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Enregistrement impossible.')
      setReference(result.reference)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Enregistrement impossible.')
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
        <h3 className="mt-4 font-display text-2xl">Intention enregistrée</h3>
        <p className="mt-3 text-sm leading-6 text-navy/65">
          Aucun paiement n’a été effectué. La Fondation pourra vous recontacter lorsque les
          modalités officielles de don seront validées.
        </p>
        <p className="mt-5 rounded-lg bg-ivory px-4 py-3 font-mono text-sm">{reference}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-7 p-6 sm:p-8">
      <div className="rounded-xl border border-gold/30 bg-gold/8 p-4 text-sm leading-6 text-navy/80">
        <strong className="flex items-center gap-2 text-navy">
          <ShieldCheck className="size-4 text-gold" />
          Aucun paiement en ligne actif
        </strong>
        Ce formulaire enregistre uniquement une intention de don. Aucun débit, aucune collecte de
        carte bancaire, aucune confirmation de paiement.
      </div>

      <div>
        <span className="label">Fréquence souhaitée</span>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ['ONE_TIME', 'Don ponctuel'],
              ['MONTHLY', 'Soutien mensuel souhaité'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={cn(
                'rounded-xl border px-4 py-3 text-sm font-medium transition',
                frequency === value
                  ? 'border-navy bg-navy text-white'
                  : 'border-navy/15 hover:border-gold',
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {frequency === 'MONTHLY' && (
          <p className="mt-2 text-xs text-navy/55">
            Souhait enregistré uniquement ; aucun abonnement ni prélèvement n’est créé.
          </p>
        )}
      </div>

      <div>
        <span className="label">Montant indicatif</span>
        <div className="mb-3 grid grid-cols-4 gap-2">
          {AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setAmount(String(value))}
              className={cn(
                'rounded-xl border py-3 text-sm font-semibold transition',
                amount === String(value)
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-navy/15 hover:border-gold',
              )}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            name="amount"
            type="number"
            min="1"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="field"
            aria-label="Montant"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="field w-28"
            aria-label="Devise"
          >
            <option>USD</option>
            <option>CDF</option>
            <option>EUR</option>
          </select>
        </div>
      </div>

      <div>
        <span className="label">Moyen de paiement envisagé</span>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setProvider('UNASSIGNED')}
            className={cn(
              'rounded-xl border p-3 text-left text-sm transition',
              provider === 'UNASSIGNED'
                ? 'border-navy bg-navy/5'
                : 'border-navy/15 hover:border-gold',
            )}
          >
            À définir avec la Fondation
          </button>
          {PAYMENT_PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setProvider(p.id)}
              className={cn(
                'rounded-xl border p-3 text-left text-sm transition',
                provider === p.id ? 'border-gold bg-gold/8' : 'border-navy/15 hover:border-gold',
              )}
            >
              <span className="font-medium">{p.label}</span>
              <span className="mt-0.5 block text-xs text-navy/50">Non activé</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="donorName">
            Nom complet *
          </label>
          <input id="donorName" name="donorName" required className="field" maxLength={120} />
        </div>
        <div>
          <label className="label" htmlFor="donorEmail">
            E-mail *
          </label>
          <input
            id="donorEmail"
            name="donorEmail"
            type="email"
            required
            className="field"
            maxLength={254}
          />
        </div>
        <div>
          <label className="label" htmlFor="donorPhone">
            Téléphone (facultatif)
          </label>
          <input id="donorPhone" name="donorPhone" type="tel" className="field" maxLength={40} />
        </div>
        <div>
          <label className="label" htmlFor="donationMessage">
            Message (facultatif)
          </label>
          <input id="donationMessage" name="message" className="field" maxLength={1000} />
        </div>
      </div>
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-navy/70">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-gold" />
        J’accepte que la Fondation conserve ces informations pour me recontacter au sujet de mon
        intention de don. Je comprends qu’aucun paiement n’est effectué.
      </label>
      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {message}
        </p>
      )}
      <button type="submit" disabled={status === 'loading'} className="btn-gold w-full">
        {status === 'loading' ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Heart className="size-4" />
        )}
        {status === 'loading' ? 'Enregistrement…' : 'Enregistrer mon intention de don'}
      </button>
    </form>
  )
}
